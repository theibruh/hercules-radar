let selectedRegion = "australia";

function toggleDropdown() {
    const menu = document.getElementById("dropdown-menu");
    menu.classList.toggle("hidden");
}

function selectRegion(value, label) {
    selectedRegion = value;
    document.getElementById("dropdown-label").innerText = label;
    document.getElementById("dropdown-menu").classList.add("hidden");
}

document.addEventListener("click", function(event) {
    const container = document.getElementById("dropdown-container");
    if (!container.contains(event.target)) {
        document.getElementById("dropdown-menu").classList.add("hidden");
    }
});

function refreshFlights() {
    const region = selectedRegion;

    fetch(`/flights?region=${region}`)
        .then(response => response.json())
        .then(data => {
            const timestampElement = document.getElementById("timestamp");
            if (timestampElement) {
                timestampElement.innerText = (data.timestamp || "N/A");
            }

            const grid = document.getElementById("flights-grid");
            grid.innerHTML = "";

            data.flights.forEach(flight => {
                const isEmergency = ['7700', '7600', '7500'].includes(flight[14]);

                const card = document.createElement("div");
                card.className = `w-full max-w-3xl bg-gray-800 rounded-xl px-6 py-4 border transition-colors duration-200 ${isEmergency ? "border-red-500 bg-red-950" : "border-gray-700 hover:border-green-500"}`;

                card.innerHTML = `
                    <div class="flex items-center justify-between">
                        <span class="text-lg font-bold text-green-400 w-32">✈ ${flight[1] || "N/A"}</span>
                        <span class="text-gray-300 w-32">🌍 ${flight[2] || "N/A"}</span>
                        <span class="text-gray-300 w-32">↑ ${flight[7] ? (flight[7] * 3.28084).toFixed(2) : "N/A"} ft</span>
                        <span class="text-gray-300 w-32">➤ ${flight[9] ? (flight[9] * 3.6).toFixed(2) : "N/A"} km/h</span>
                        <span class="text-gray-300 w-32">⚡ ${flight[9] ? (flight[9] * 1.94384).toFixed(2) : "N/A"} kts</span>
                        <span class="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">${flight[14] || "N/A"}</span>
                        ${isEmergency ? '<span class="text-red-400 text-xs font-bold">⚠ EMERGENCY</span>' : ""}
                    </div>
                `;

                grid.appendChild(card);
            });
        })
        .catch(function(error) {
            console.error("Error fetching flights:", error);
        });
}