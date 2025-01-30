from flask import Flask


app = Flask(__name__)


@app.route('/')
def index():
    return "SOEN-343 Project"



app.run(debug = True)