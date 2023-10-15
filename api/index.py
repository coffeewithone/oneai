from flask_cors import CORS
from flask import Flask, request, jsonify, Response, stream_with_context

import openai
import os

app = Flask(__name__)

CORS(app)
# for chunk in openai.ChatCompletion.create(
#     model="gpt-3.5-turbo",
#     messages=[{
#         "role": "user",
#         "content": "Generate name of 20 pet robots names that will make you laugh"
#     }],
#     stream=True,
# ): 
#     content = chunk["choices"][0].get("delta", {}).get("content")
#     if content is not None:
#         print(content, end='')



@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route('/generate-answer', methods=['POST'])
def generate_names():
    openai.api_key = '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'
    input_content = request.json.get('content', 'Generate a list of 20 great names for sentient cheesecakes that teach SQL')

    def generate():
        for chunk in openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{
                "role": "system",
                "content": "You are a helpful assistant."
             },{
                "role": "user",
                "content": input_content
            }],
            stream=True
        ):
            content = chunk["choices"][0].get("delta", {}).get("content")
            if content is not None:
                yield content 

    return Response(stream_with_context(generate()), content_type='text/plain')

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, threaded = True)