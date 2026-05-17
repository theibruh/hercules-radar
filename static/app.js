let selectedRegion = "australia";
let mapInstances = {};
let animationIntervals = {};
let fetchIntervals = {};

function searchFlights() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const cards = document.getElementById("flights-grid").children;
  Array.from(cards).forEach((card) => {
    const callsign = card.querySelector("span.text-green-400");
    if (callsign) {
      const text = callsign.innerText.toLowerCase();
      card.style.display = text.includes(query) ? "" : "none";
    }
  });
}

function toggleDropdown() {
  const menu = document.getElementById("dropdown-menu");
  menu.classList.toggle("hidden");
}

function selectRegion(value, label) {
  selectedRegion = value;
  document.getElementById("dropdown-label").innerText = label;
  document.getElementById("dropdown-menu").classList.add("hidden");
}

document.addEventListener("click", function (event) {
  const container = document.getElementById("dropdown-container");
  const menu = document.getElementById("dropdown-menu");
  if (container && menu && !container.contains(event.target)) {
    menu.classList.add("hidden");
  }
});

function refreshFlights() {
  const region = selectedRegion;

  fetch(`/flights?region=${region}`)
    .then((response) => response.json())
    .then((data) => {
      const timestampElement = document.getElementById("timestamp");
      if (timestampElement) {
        timestampElement.innerText = data.timestamp || "N/A";
      }

      mapInstances = {};
      animationIntervals = {};
      fetchIntervals = {};

      const grid = document.getElementById("flights-grid");
      grid.innerHTML = "";

      data.flights.forEach((flight) => {
        const isEmergency = ["7700", "7600", "7500"].includes(flight[14]);
        const callsign = (flight[1] || "").trim() || "N/A";
        const lat = flight[6];
        const lon = flight[5];
        const heading = flight[10] || 0;
        const speed = flight[9] ? flight[9] * 1.94384 : 0;

        const card = document.createElement("div");
        card.className = `w-full max-w-3xl bg-gray-800 rounded-xl border transition-colors duration-200 ${isEmergency ? "border-red-500 bg-red-950" : "border-gray-700 hover:border-green-500"} group`;

        card.setAttribute(
          "onmouseenter",
          `showDetails(this, ${lat}, ${lon}, '${callsign}', ${heading}, ${speed})`,
        );
        card.setAttribute("onmouseleave", "hideDetails(this)");

        card.innerHTML = `
          <div class="flex items-center justify-between px-6 py-4">
            <span class="text-lg font-bold text-green-400 w-32">✈ ${callsign}</span>
            <span class="text-gray-300 w-32">🌍 ${flight[2] || "N/A"}</span>
            <span class="text-gray-300 w-32">↑ ${flight[7] ? (flight[7] * 3.28084).toFixed(2) : "N/A"} ft</span>
            <span class="text-gray-300 w-32">➤ ${flight[9] ? (flight[9] * 3.6).toFixed(2) : "N/A"} km/h</span>
            <span class="text-gray-300 w-32">⚡ ${flight[9] ? (flight[9] * 1.94384).toFixed(2) : "N/A"} kts</span>
            <span class="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">${flight[14] || "N/A"}</span>
            ${isEmergency ? '<span class="text-red-400 text-xs font-bold">⚠ EMERGENCY</span>' : ""}
          </div>
          <div class="details-panel hidden border-t border-gray-700 px-6 py-4">
            <div class="flex gap-4">
              <div class="map-container rounded-lg overflow-hidden" style="width: 200px; height: 150px;"></div>
              <div class="flex flex-col gap-2 text-sm text-gray-300">
                <p>📍 Lat: ${lat || "N/A"}</p>
                <p>📍 Lon: ${lon || "N/A"}</p>
                <p>🧭 Heading: ${heading}°</p>
                <p>🛬 On Ground: ${flight[8] ? "Yes" : "No"}</p>
                <p>✈ Category: ${flight[17] || "N/A"}</p>
              </div>
            </div>
          </div>
        `;

        grid.appendChild(card);
      });
    })
    .catch(function (error) {
      console.error("Error fetching flights:", error);
    });
}

function createPlaneIcon(heading) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(${heading}deg);
    ">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="#f97316">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function startAnimation(mapId, heading, speed) {
  if (animationIntervals[mapId]) return;
  // Convert speed from knots to degrees per second (approximation)
  // 1 knot == 1/60 degree lat per hour, so 1 knot == (1/60)/(60*60) degree per second
  const KNOTS_TO_DEG_PER_SEC = 0.000005;
  // radians= degrees * (pi/180)
  //calculated once to optimize performance since heading doesn't change during animation
  const headingRad = (heading * Math.PI) / 180;

  animationIntervals[mapId] = setInterval(() => {
    const instance = mapInstances[mapId];
    if (!instance) return;

    const currentPos = instance.marker.getLatLng();
    // latitude North/South movement per second = cos(heading) * speed in deg/sec

    const deltaLat = Math.cos(headingRad) * speed * KNOTS_TO_DEG_PER_SEC;

    // longitude East/West movement per second = sin(heading) * speed in deg/sec

    const deltaLon = Math.sin(headingRad) * speed * KNOTS_TO_DEG_PER_SEC;

    // Update position by adding the deltas to the current position

    const newLat = currentPos.lat + deltaLat;
    const newLon = currentPos.lng + deltaLon;

    // Move the marker to the new position and pan the map to follow it

    instance.marker.setLatLng([newLat, newLon]);
    instance.map.panTo([newLat, newLon], { animate: true, duration: 1 });
  }, 1000);
}


function stopAnimation(mapId) {
  // clearInterval on undefined woudnt cause an error but we check to avoid unnecessary calls
  if (animationIntervals[mapId]) {
    clearInterval(animationIntervals[mapId]);
    // Delete the interval to avoid guard clause from preventing future animations if the same mapId is reused
    delete animationIntervals[mapId];
  }
}

function startPositionFetch(mapId, callsign, heading, speed) {
  if (fetchIntervals[mapId]) return;

  fetchIntervals[mapId] = setInterval(() => {
    fetch(`/aircraft?callsign=${callsign}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.lat && data.lon) {
          const instance = mapInstances[mapId];
          if (!instance) return;
          instance.marker.setLatLng([data.lat, data.lon]);
          instance.map.panTo([data.lat, data.lon], {
            animate: true,
            duration: 1,
          });
        }
      })
      .catch((err) => console.error("Position fetch error:", err));
  }, 30000);
}

function stopPositionFetch(mapId) {
  if (fetchIntervals[mapId]) {
    clearInterval(fetchIntervals[mapId]);
    delete fetchIntervals[mapId];
  }
}

function showDetails(card, lon, lat, callsign, heading, speed) {
  const panel = card.querySelector(".details-panel");
  panel.classList.remove("hidden");

  if (lat && lon) {
    const mapContainer = panel.querySelector(".map-container");
    const mapId = "map-" + callsign.trim();
    mapContainer.id = mapId;

    if (!mapInstances[mapId]) {
      setTimeout(() => {
        const map = L.map(mapId, {
          zoomControl: false,
          dragging: false,
          scrollWheelZoom: false,
        }).setView([lat, lon], 6);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
        }).addTo(map);

        const marker = L.marker([lat, lon], {
          icon: createPlaneIcon(heading || 0),
        }).addTo(map);

        mapInstances[mapId] = { map, marker };

        mapContainer.addEventListener("click", () => {
          openFullMap(lat, lon, callsign, heading, speed);
        });

        startAnimation(mapId, heading || 0, speed || 0);
        startPositionFetch(mapId, callsign, heading, speed);
      }, 50);
    } else {
      startAnimation(mapId, heading || 0, speed || 0);
      startPositionFetch(mapId, callsign, heading, speed);
    }
  }
}

function hideDetails(card) {
  const panel = card.querySelector(".details-panel");
  panel.classList.add("hidden");

  const mapContainer = panel.querySelector(".map-container");
  if (mapContainer && mapContainer.id) {
    stopAnimation(mapContainer.id);
    stopPositionFetch(mapContainer.id);
  }
}

function openFullMap(lat, lon, callsign, heading, speed) {
  const win = window.open("", "_blank");
  win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${callsign} - Hercules Radar</title>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"><\/script>
            <style>
                body { margin: 0; background: #030712; }
                #fullmap { width: 100vw; height: 100vh; }
            </style>
        </head>
        <body>
            <div id="fullmap"></div>
            <script>
                const heading = ${heading || 0};
                const speed = ${speed || 0};
                const KNOTS_TO_DEG_PER_SEC = 0.000005;
                const headingRad = (heading * Math.PI) / 180;

                const planeIcon = L.divIcon({
                    className: "",
                    html: '<div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;transform:rotate(' + heading + 'deg)"><svg viewBox="0 0 24 24" width="36" height="36" fill="#f97316"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></div>',
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                });

                const map = L.map("fullmap").setView([${lat}, ${lon}], 8);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "© OpenStreetMap"
                }).addTo(map);

                let marker = L.marker([${lat}, ${lon}], { icon: planeIcon }).addTo(map);
                marker.bindPopup("${callsign}").openPopup();

                let currentLat = ${lat};
                let currentLon = ${lon};

                setInterval(() => {
                    const deltaLat = Math.cos(headingRad) * speed * KNOTS_TO_DEG_PER_SEC;
                    const deltaLon = Math.sin(headingRad) * speed * KNOTS_TO_DEG_PER_SEC;
                    currentLat += deltaLat;
                    currentLon += deltaLon;
                    marker.setLatLng([currentLat, currentLon]);
                    map.panTo([currentLat, currentLon], { animate: true, duration: 1 });
                }, 1000);

                setInterval(() => {
                    fetch('/aircraft?callsign=${callsign}')
                        .then(r => r.json())
                        .then(data => {
                            if (data.lat && data.lon) {
                                currentLat = data.lat;
                                currentLon = data.lon;
                                marker.setLatLng([data.lat, data.lon]);
                                map.panTo([data.lat, data.lon], { animate: true, duration: 1 });
                            }
                        });
                }, 30000);
            <\/script>
        </body>
        </html>
    `);
}


