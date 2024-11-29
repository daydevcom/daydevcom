async function fetchReportData() {
    const tableBody = document.getElementById("report-table").querySelector("tbody");

    try {
        const snapshot = await db.collection("attendance").orderBy("timestamp", "asc").get();

        snapshot.forEach(doc => {
            const data = doc.data();

            // Extract only the time part from the timestamp
            const fullTimestamp = data.timestamp; // Example: "29/11/2024, 14:28:01"
            const timeOnly = fullTimestamp.split(', ')[1]; // Extract the part after ", "

            const row = document.createElement("tr");

            row.innerHTML = `
        <td class="mdl-data-table__cell--non-numeric">${data.name}</td>
        <td>${data.status}</td>
        <td>${data.date}</td>
        <td>${timeOnly}</td>
    `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call the function to fetch and render data
fetchReportData();