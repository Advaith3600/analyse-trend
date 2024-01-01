from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/analyse_trend/')
def index():
    return jsonify(message='Hello from Flask on AWS Lambda!')

if __name__ == '__main__':
    app.run()