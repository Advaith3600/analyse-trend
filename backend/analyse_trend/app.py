import boto3
from flask import Flask, jsonify

app = Flask(__name__)

# Create a DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('analyseTrend')

@app.route('/analyse_trend/')
def index():
    return jsonify(message='Hello from Flask on AWS Lambda!')

if __name__ == '__main__':
    app.run()