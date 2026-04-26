from flask import Flask, render_template
import requests
from datetime import datetime

app = Flask(__name__)

@app.route("/")
def index():
    response = requests.get("https://opensky-network.org/api/states/all?lamin=-44&lomin=113&lamax=-10&lomax=154&extended=1")
    data = response.json()
    aircraft_list = data["states"]
    timestamp = datetime.fromtimestamp(data["time"]).strftime("%H:%M:%S")
    return render_template("index.html", flights=aircraft_list, timestamp=timestamp)

@app.route("/flights")
def get_flights():
    response = requests.get("https://opensky-network.org/api/states/all?lamin=-44&lomin=113&lamax=-10&lomax=154&extended=1")
    data = response.json()
    aircraft_list = data["states"]
    timestamp = datetime.fromtimestamp(data["time"]).strftime("%H:%M:%S")
    return {"flights": aircraft_list, "timestamp": timestamp}

if __name__ == "__main__":
    app.run(debug=True)