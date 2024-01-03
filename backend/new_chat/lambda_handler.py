import os
import json
import boto3
from openai import OpenAI
from trends import get_google_trends, get_reddit_trend
from commands import commands
from common.Auth0 import Auth0

CHATS_TABLE = 'AnalyseTrend-Chats'
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
auth0 = Auth0()

def lambda_handler(event, context):
    data = json.loads(event)

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={ "type": "json_object" },
        messages=[
            { "role": "system", "content": commands['keywords'] },
            { "role": "user", "content": data['input'] }
        ]
    )
    print('json generation done')

    parsed_json = json.loads(response.choices[0].message.content)
    reddit = get_reddit_trend(parsed_json['reddit']['subreddits'], parsed_json['reddit']['keywords'])
    print('reddit done')
    google = get_google_trends(parsed_json['gtrends'])
    print('google done')

    chat_completion = client.chat.completions.create(
        model='gpt-4-1106-preview' if data['model'] == 'gpt-4' else "gpt-3.5-turbo", 
        messages=[
            {
                "role": "system",
                "content": commands['analyse'] + f'\n{reddit}\n{google}'
            },
            { "role": "user", "content": data['input'] }
        ]
    )
    print('chat completion done')

    user_id = data['user_id']
    token = data['token']
    credits = data['credits'] - 3 if data['model'] == 'gpt-4' else 1
    auth0.patch_data(f'/api/v2/users/{user_id}', f'Bearer {token}', {
        "app_metadata": {
            "credits": credits
        }
    })
    print('user credits updated')
    
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(CHATS_TABLE)
    response = table.put_item(Item={
        'id': data['id'],
        'chat_id': chat_completion.id,
        'user_id': user_id,
        'context': f'\n{reddit}\n{google}',
        'chat': [
            { 'role': 'user', 'content': data['input'] },
            dict(chat_completion.choices[0].message)
        ],
        'title': parsed_json['title'] if 'title' in parsed_json else 'New Chat',
        "created": chat_completion.created,
        "model": chat_completion.model,
        "completion_usage": dict(chat_completion.usage),
        'json_usage': dict(response.usage)
    })
    print('dynamodb updated')