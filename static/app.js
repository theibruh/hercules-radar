function refreshFlights() {
    fetch("/flights")
        .then(response => response.json())
        .then(data => {
            const timestampElement = document.getElementById("timestamp");
            if (timestampElement) {
                timestampElement.innerText = (data.timestamp || "N/A");
            }
        
            const table = document.getElementById("flights-table");
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
            data.flights.forEach(flight => {
                const row = table.insertRow();
                row.insertCell(0).innerText = flight[1] || "N/A";
                row.insertCell(1).innerText = flight[2] || "N/A";
                row.insertCell(2).innerText = flight[7] ? (flight[7] * 3.28084).toFixed(2) : "N/A";
                row.insertCell(3).innerText = flight[9] ? (flight[9] * 3.6).toFixed(2) : "N/A";
                row.insertCell(4).innerText = flight[9] ? (flight[9] * 1.94384).toFixed(2) : "N/A";
                row.insertCell(5).innerText = flight[14] || "N/A";
                row.insertCell(6).innerText = flight[17] || "N/A";
            });
        })
        .catch(function(error) {
            console.error("Error fetching flights:", error);
        });
}