from flask import Flask, render_template, request
import requests
from datetime import datetime

app = Flask(__name__)

REGIONS = {
    "australia": {"lamin": -44, "lomin": 113, "lamax": -10, "lomax": 154},
    "europe": {"lamin": 36, "lomin": -10, "lamax": 71, "lomax": 40},
    "north_america": {"lamin": 15, "lomin": -170, "lamax": 72, "lomax": -50},
    "asia": {"lamin": 10, "lomin": 60, "lamax": 55, "lomax": 150},
    "south_america": {"lamin": -56, "lomin": -81, "lamax": 13, "lomax": -34},
    "africa": {"lamin": -35, "lomin": -18, "lamax": 38, "lomax": 52},
    "middle_east": {"lamin": 12, "lomin": 32, "lamax": 42, "lomax": 65},
}

@app.route("/")
def index():
    region = REGIONS["australia"]
    try:
        response = requests.get(f"https://opensky-network.org/api/states/all?lamin={region['lamin']}&lomin={region['lomin']}&lamax={region['lamax']}&lomax={region['lomax']}&extended=1")
        data = response.json()
        aircraft_list = data["states"]
        timestamp = datetime.fromtimestamp(data["time"]).strftime("%H:%M:%S")
    except Exception as e:
        print(f"[INDEX ROUTE] Failed to fetch OpenSky data - bruhh likely rate limited or API down: {e}")
        aircraft_list = []
        timestamp = "N/A 'Api Error'"
    return render_template("index.html", flights=aircraft_list, timestamp=timestamp)

@app.route("/flights")
def get_flights():
    region_name = request.args.get("region", "australia")
    region = REGIONS.get(region_name, REGIONS["australia"])
    try:
        response = requests.get(f"https://opensky-network.org/api/states/all?lamin={region['lamin']}&lomin={region['lomin']}&lamax={region['lamax']}&lomax={region['lomax']}&extended=1")
        data = response.json()
        aircraft_list = data["states"]
        timestamp = datetime.fromtimestamp(data["time"]).strftime("%H:%M:%S")
    except Exception as e:
        print(f"[FLIGHTS ROUTE] Failed to fetch OpenSky data - ':(' likely rate limited or API down: {e}")
        aircraft_list = []
        timestamp = "N/A 'Api Error'"
    return {"flights": aircraft_list, "timestamp": timestamp}

@app.route("/aircraft")
def get_aircraft():
    callsign = request.args.get("callsign", "").strip().upper()
    try:
        response = requests.get(f"https://opensky-network.org/api/states/all?extended=1")
        data = response.json()
        for flight in data["states"]:
            if flight[1] and flight[1].strip().upper() == callsign:
                return {
                    "lat": flight[6],
                    "lon": flight[5],
                    "heading": flight[10],
                    "speed": flight[9]
                }
    except Exception as e:
        print(f"[AIRCRAFT ROUTE] Failed to fetch OpenSky data - ':(' likely rate limited or API down: {e}")
    return {"lat": None, "lon": None}


if __name__ == "__main__":
    app.run(debug=True)