document.addEventListener("DOMContentLoaded", function () {

    chrome.storage.local.get(["scanHistory"], function (data) {

        const history = data.scanHistory || [];

        const total = history.length;
        const scams = history.filter(h => h.risk === "HIGH_RISK").length;
        const suspicious = history.filter(h => h.risk === "SUSPICIOUS").length;
        const safe = history.filter(h => h.risk === "LIKELY_REAL").length;

        document.getElementById("totalScans").textContent = total;
        document.getElementById("scamsDetected").textContent = scams;

        const rate = total > 0 ? ((scams / total) * 100).toFixed(1) : 0;
        document.getElementById("detectionRate").textContent = rate + "%";

        // PIE CHART
        new Chart(document.getElementById("pieChart"), {
            type: "pie",
            data: {
                labels: ["High Risk", "Suspicious", "Likely Real"],
                datasets: [{
                    data: [scams, suspicious, safe],
                    backgroundColor: ["#e53935", "#fb8c00", "#43a047"]
                }]
            }
        });

        // BAR CHART (Last 7 Days Activity)
        const last7Days = {};
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const key = d.toLocaleDateString();
            last7Days[key] = 0;
        }

        history.forEach(item => {
            const date = new Date(item.timestamp).toLocaleDateString();
            if (last7Days.hasOwnProperty(date)) {
                last7Days[date]++;
            }
        });

        new Chart(document.getElementById("barChart"), {
            type: "bar",
            data: {
                labels: Object.keys(last7Days).reverse(),
                datasets: [{
                    label: "Scans",
                    data: Object.values(last7Days).reverse(),
                    backgroundColor: "#1976d2"
                }]
            }
        });

        // RECENT SCANS
        const recentDiv = document.getElementById("recentScans");
        recentDiv.innerHTML = "";

        history.slice(0, 10).forEach(item => {

            const div = document.createElement("div");
            div.className = "scan-item";

            const date = new Date(item.timestamp).toLocaleDateString();

            div.innerHTML = `
                ${item.title}
                <span class="badge ${item.risk}">${item.risk}</span>
                <div class="date">${date}</div>
            `;

            recentDiv.appendChild(div);
        });

        if (history.length === 0) {
            recentDiv.innerHTML = "<p>No scans yet. Scan some jobs first.</p>";
        }

    });

});