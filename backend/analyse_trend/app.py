# import boto3
import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], methods=['POST'])

# Create a DynamoDB resource
# dynamodb = boto3.resource('dynamodb')
# table = dynamodb.Table('AnalyseTrend')

# @TODO: Add logging


@app.route('/analyse_trend/', methods=['POST'])
def index():
    ISSUER_BASE_URL = os.environ.get("AUTH0_ISSUER_BASE_URL")
    auth_token = request.headers.get('Authorization')
    response = requests.get(f'{ISSUER_BASE_URL}/userinfo/', headers={'Authorization': auth_token})
    response_parsed = response.json()
    sub = response_parsed['sub'] if response_parsed['sub'] else None
    credits = 0

    if response.status_code == 200 and sub:
        user_response = requests.get(f'{ISSUER_BASE_URL}/api/v2/users/{sub}', headers={'Authorization': auth_token})
        user_response_parsed = user_response.json()

        if user_response.status_code != 200 or user_response_parsed['app_metadata']['credits'] <= 0:
            return jsonify({"error": "Please buy more credits to use the service."}), 403
        
        credits = user_response_parsed['app_metadata']['credits']
    else:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    input = data['input']

    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    chat_completion = client.chat.completions.create(model="gpt-3.5-turbo", messages=[
        {
            "role": "user",
            "content": input
        }
    ])

    requests.patch(
        f'{ISSUER_BASE_URL}/api/v2/users/{sub}', 
        headers={'Authorization': auth_token}, 
        json={
            "app_metadata": {
                "credits": credits - 1
            }
        }
    )

    return jsonify('something here')
    return jsonify(chat_completion.choices[0].message.content)

if __name__ == '__main__':
    app.run()