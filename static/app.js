let selectedRegion = "australia";
let mapInstances = {};

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
  if (!container.contains(event.target)) {
    document.getElementById("dropdown-menu").classList.add("hidden");
  }
});

function showDetails(card, lon, lat, callsign) {
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

        L.marker([lat, lon]).addTo(map);

        mapInstances[mapId] = map;

        mapContainer.addEventListener("click", () => {
          openFullMap(lat, lon, callsign);
        });
      }, 50);
    }
  }
}

function hideDetails(card) {
  const panel = card.querySelector(".details-panel");
  panel.classList.add("hidden");
}

function openFullMap(lat, lon, callsign) {
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
                const map = L.map("fullmap").setView([${lat}, ${lon}], 8);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: "© OpenStreetMap"
                }).addTo(map);
                L.marker([${lat}, ${lon}]).bindPopup("${callsign}").openPopup().addTo(map);
            <\/script>
        </body>
        </html>
    `);
}

function refreshFlights() {
  const region = selectedRegion;

  fetch(`/flights?region=${region}`)
    .then((response) => response.json())
    .then((data) => {
      const timestampElement = document.getElementById("timestamp");
      if (timestampElement) {
        timestampElement.innerText = data.timestamp || "N/A";
      }

      // Reset map instances when refreshing
      mapInstances = {};

      const grid = document.getElementById("flights-grid");
      grid.innerHTML = "";

      data.flights.forEach((flight) => {
        const isEmergency = ["7700", "7600", "7500"].includes(flight[14]);
        const callsign = (flight[1] || "").trim() || "N/A";
        const lat = flight[6];
        const lon = flight[5];

        const card = document.createElement("div");
        card.className = `w-full max-w-3xl bg-gray-800 rounded-xl border transition-colors duration-200 ${isEmergency ? "border-red-500 bg-red-950" : "border-gray-700 hover:border-green-500"} group`;

        card.setAttribute("onmouseenter", `showDetails(this, ${lon}, ${lat}, '${callsign}')`);
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
                <p>🧭 Heading: ${flight[10] || "N/A"}°</p>
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
