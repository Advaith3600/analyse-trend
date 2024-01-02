import boto3
import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI
from Auth0 import Auth0
from commands import commands
from trends import get_reddit_trend, get_google_trends

auth0 = Auth0()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], methods=['GET', 'POST'])

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('AnalyseTrend-Chats')

@app.route('/analyse_trend/chat/', methods=['POST'])
def index():
    response_status_code, response_parsed = auth0.get_data('/userinfo/', request.headers.get('Authorization'))
    if response_status_code != 200:
        return jsonify({"error": "Unauthorized"}), 401
    
    token = auth0.get_token()
    sub = response_parsed['sub']
    user_response_status_code, user_response_parsed = auth0.get_data(f'/api/v2/users/{sub}', f'Bearer {token}')

    if user_response_status_code != 200:
        return jsonify({"error": "Oops! Something went wrong. Please try again."}), 500
    elif user_response_parsed['app_metadata']['credits'] <= 0:
        return jsonify({"error": "Please buy more credits to use the service."}), 403
    
    credits = user_response_parsed['app_metadata']['credits']

    data = request.get_json()
    input = data['input']

    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={ "type": "json_object" },
        messages=[
            { "role": "system", "content": commands['keywords'] },
            { "role": "user", "content": input }
        ]
    )

    parsed_json = json.loads(response.choices[0].message.content)
    print(parsed_json)
    reddit = get_reddit_trend(parsed_json['reddit']['subreddits'], parsed_json['reddit']['keywords'])
    google = get_google_trends(parsed_json['gtrends'])

    chat_completion = client.chat.completions.create(model="gpt-3.5-turbo", messages=[
        {
            "role": "system",
            "content": commands['analyse'] + f'\n{reddit}\n{google}'
        },
        { "role": "user", "content": input }
    ])

    auth0.patch_data(f'/api/v2/users/{sub}', f'Bearer {token}', {
        "app_metadata": {
            "credits": credits - 1
        }
    })
    
    response = table.put_item(Item={
        'id': chat_completion.id,
        'user_id': sub,
        'chat': [
            { 'role': 'user', 'content': input },
            dict(chat_completion.choices[0].message)
        ],
        'title': parsed_json['title'],
        "created": chat_completion.created,
        "model": chat_completion.model,
        "completion_usage": dict(chat_completion.usage),
        'json_usage': dict(response.usage)
    })

    return jsonify({
        'output': chat_completion.choices[0].message.content,
        'credits': credits - 1
    })

@app.route('/analyse_trend/chats/')
def chats():
    response_status_code, response_parsed = auth0.get_data('/userinfo/', request.headers.get('Authorization'))
    if response_status_code != 200:
        return jsonify({"error": "Unauthorized"}), 401
    
    response = table.scan(
        FilterExpression=boto3.dynamodb.conditions.Key('user_id').eq(response_parsed['sub']),
        ProjectionExpression='title, id'
    )

    return jsonify(response['Items'])

@app.route('/analyse_trend/chat/<id>/')
def chat(id):
    response_status_code, response_parsed = auth0.get_data('/userinfo/', request.headers.get('Authorization'))
    if response_status_code != 200:
        return jsonify({"error": "Unauthorized"}), 401
    
    response = table.get_item(
        Key={
            'id': id,
            'user_id': response_parsed['sub']
        }
    )

    return jsonify(response['Item'])

if __name__ == '__main__':
    app.run()