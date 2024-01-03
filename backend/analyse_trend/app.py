import os
import uuid
import json
import boto3
from flask import Flask, jsonify, request
from flask_cors import CORS
from common.Auth0 import Auth0

auth0 = Auth0()
CHATS_TABLE = 'AnalyseTrend-Chats'

app = Flask(__name__)
CORS(app, origins=[os.environ.get('ALLOWED_ORIGIN')], methods=['GET', 'POST'])

@app.route('/analyse_trend/chat/', methods=['POST'])
def index():
    data = request.get_json()

    response_status_code, response_parsed = auth0.get_data('/userinfo/', request.headers.get('Authorization'))
    if response_status_code != 200:
        return jsonify({"error": "Unauthorized"}), 401
    
    token = auth0.get_token()
    sub = response_parsed['sub']
    user_response_status_code, user_response_parsed = auth0.get_data(f'/api/v2/users/{sub}', f'Bearer {token}')

    if user_response_status_code != 200:
        return jsonify({"error": "Oops! Something went wrong. Please try again."}), 500
    
    credits = user_response_parsed['app_metadata']['credits']

    if credits <= 0 or (data['model'] == 'gpt-4' and credits < 3):
        return jsonify({"error": "Please buy more credits to use the service."}), 403
    
    id = str(uuid.uuid4())
    lambda_client = boto3.client('lambda')
    lambda_client.invoke(
        FunctionName=os.environ.get('NEW_CHAT_ARN'),
        InvocationType='Event',
        Payload=json.dumps({
            'id': id,
            'user_id': sub,
            'input': data['input'],
            'model': data['model'],
            'token': token,
            'credits': credits
        })
    )

    return jsonify({ "message": "Generation started", "id": id }), 200

@app.route('/analyse_trend/chats/', methods=['GET'])
def chats():
    response_status_code, response_parsed = auth0.get_data('/userinfo/', request.headers.get('Authorization'))
    if response_status_code != 200:
        return jsonify({"error": "Unauthorized"}), 401
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(CHATS_TABLE)
    
    response = table.query(
        KeyConditionExpression=boto3.dynamodb.conditions.Key('user_id').eq(response_parsed['sub']),
        ProjectionExpression='title, id'
    )

    return jsonify(response['Items'])

@app.route('/analyse_trend/chat/<id>/', methods=['GET'])
def chat(id):
    response_status_code, response_parsed = auth0.get_data('/userinfo/', request.headers.get('Authorization'))
    if response_status_code != 200:
        return jsonify({"error": "Unauthorized"}), 401
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(CHATS_TABLE)
    
    response = table.get_item(
        Key={
            'id': id,
            'user_id': response_parsed['sub']
        }
    )

    return (jsonify(response['Item']), 200) if 'Item' in response else (jsonify({ "error": "Chat not found" }), 404)

if __name__ == '__main__':
    app.run()