from flask import Flask
from flask_restful import Api, Resource
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
api = Api(app)


class HelloWorld(Resource):
    def get(self):
        return "hello world"


api.add_resource(HelloWorld, "/helloworld")

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5066))
    app.run(debug=True, host='0.0.0.0', port=port)
