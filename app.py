# import files
from flask import Flask, render_template, request, jsonify
import warnings
from prediction import predict_response
from autocorrect import Speller
spell = Speller('en')
warnings.filterwarnings("ignore")

app = Flask(__name__)


@app.route('/', methods=['get'])
def index():
    return render_template("index.html")


@app.route('/about', methods=['get'])
def about():
    return render_template("about-us.html")


@app.route('/typography', methods=['get'])
def typography():
    return render_template("typography.html")


@app.route('/contacts', methods=['get'])
def contacts():
    return render_template("contacts.html")


@app.route('/predict', methods=['POST'])
def predict():
    # userText = request.args.get('msg')
    userText = request.get_json().get('message')
    print("Input text", userText)
    userText = userText.lower()

    if userText == "how does camomile tea look like":
        img = "static/items/tea.jpeg"
        message = {"answer": img}
    elif userText == "what is the difference between robusta and arabica":
        img = "static/items/coffee.jpeg"
        message = {"answer": img}
    elif userText == 'what type of noodles are used for different orders':
        img = "static/items/noodles.jpeg"
        message = {"answer": img}
    elif userText == 'what is the type of milk used for preparing orders':
        img = "static/items/milk.jpeg"
        message = {"answer": img}
    else:
        new_text = ''
        for word in userText.split():
            new_text += spell(word) + ' '
        res = predict_response(new_text)
        print('Corrected text:', new_text)
        print('Response', res)
        message = {"answer": res}
    return jsonify(message)


if __name__ == "__main__":
    app.run(debug=True)
