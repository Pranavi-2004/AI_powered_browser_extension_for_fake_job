const API_URL = "https://unpearled-frederick-loxodromically.ngrok-free.dev/predict";

document.addEventListener("DOMContentLoaded", function () {

    const scanBtn = document.getElementById("scanBtn");
    const analyticsBtn = document.getElementById("analyticsBtn");
    const result = document.getElementById("result");
    const banner = document.getElementById("riskBanner");
    const meterBar = document.getElementById("meterBar");
    const statsDiv = document.getElementById("stats");
    const keywordsDiv = document.getElementById("keywords");

    // ✅ Dashboard Button (Fixed Properly)
    analyticsBtn.addEventListener("click", function () {
        chrome.tabs.create({ url: "dashboard.html" });
    });

    // Load last scanned job if exists
    chrome.storage.local.get(["lastJobText"], function (data) {
        if (data.lastJobText) {
            analyzeJob(data.lastJobText);
        }
    });

    // Scan Button
    scanBtn.addEventListener("click", async function () {

        const tabs = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        const tab = tabs[0];

        if (!tab.url.includes("indeed.com")) {
            result.textContent = "Open an Indeed job page first.";
            return;
        }

        chrome.tabs.sendMessage(tab.id, {
            action: "START_SELECTION_MODE"
        });

        result.textContent = "Now click a job title on the page...";
    });

    // ===============================
    // 🔍 AI ANALYSIS FUNCTION
    // ===============================

    async function analyzeJob(text) {

        if (!text || text.length < 20) {
            result.textContent = "Job text too short.";
            return;
        }

        result.textContent = "Analyzing with AI...";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();

            showRisk(data);
            showMeter(data);
            updateStats(data);
            saveScanHistory(text, data);

            const detectedKeywords = detectKeywords(text);
            showKeywords(detectedKeywords);

            const highlightedText = highlightText(text, detectedKeywords);

            result.innerHTML = `
                <b>Real Probability:</b> ${data.real_probability}<br>
                <b>Fake Probability:</b> ${data.fake_probability}
                <hr>
                ${highlightedText}
            `;

        } catch (error) {
            result.textContent = "Backend error. Is server running?";
        }
    }

    // ===============================
    // 🎯 RISK DISPLAY
    // ===============================

    function showRisk(data) {

        banner.style.display = "block";

        const fakePercent = data.fake_probability;

        if (fakePercent > 0.8) {
            banner.textContent = "HIGH RISK";
            banner.style.background = "#ff4d4d";
        }
        else if (fakePercent > 0.4) {
            banner.textContent = "SUSPICIOUS";
            banner.style.background = "#ff9800";
        }
        else {
            banner.textContent = "LIKELY REAL";
            banner.style.background = "#4CAF50";
        }

        banner.style.color = "white";
    }

    function showMeter(data) {

        const fakePercent = data.fake_probability * 100;

        meterBar.style.width = fakePercent + "%";

        if (fakePercent > 80) {
            meterBar.style.background = "#ff4d4d";
        } else if (fakePercent > 40) {
            meterBar.style.background = "#ff9800";
        } else {
            meterBar.style.background = "#4CAF50";
        }
    }

    // ===============================
    // 📊 STATS COUNTER
    // ===============================

    function updateStats(data) {

        chrome.storage.local.get(["totalScanned", "scamsDetected"], function (stats) {

            let total = stats.totalScanned || 0;
            let scams = stats.scamsDetected || 0;

            total++;

            if (data.fake_probability > 0.8) {
                scams++;
            }

            chrome.storage.local.set({
                totalScanned: total,
                scamsDetected: scams
            });

            statsDiv.innerHTML =
                "Jobs Scanned: " + total + "<br>Scams Detected: " + scams;
        });
    }

    // ===============================
    // 🧠 STORE SCAN HISTORY (For Dashboard)
    // ===============================

    function saveScanHistory(text, data) {

        chrome.storage.local.get(["scanHistory"], function (storage) {

            let history = storage.scanHistory || [];

            const entry = {
                title: text.substring(0, 80),
                fakeProbability: data.fake_probability,
                risk: data.fake_probability > 0.8
                    ? "HIGH_RISK"
                    : data.fake_probability > 0.4
                        ? "SUSPICIOUS"
                        : "LIKELY_REAL",
                timestamp: Date.now()
            };

            history.unshift(entry);

            if (history.length > 50) {
                history = history.slice(0, 50);
            }

            chrome.storage.local.set({ scanHistory: history });
        });
    }

    // ===============================
    // 🚩 KEYWORD DETECTION
    // ===============================

    function detectKeywords(text) {

        const suspiciousWords = [
            "urgent",
            "immediately",
            "no experience",
            "work from home",
            "whatsapp",
            "telegram",
            "gmail",
            "bond",
            "contract length",
            "earn from home"
        ];

        const found = [];
        const lower = text.toLowerCase();

        suspiciousWords.forEach(word => {
            if (lower.includes(word)) {
                found.push(word);
            }
        });

        return found;
    }

    function showKeywords(words) {

        if (words.length === 0) {
            keywordsDiv.innerHTML = "";
            return;
        }

        keywordsDiv.innerHTML = "<b>Detected Keywords:</b><br>" +
            words.map(w =>
                `<span style="
                    display:inline-block;
                    background:#ffe0b2;
                    padding:3px 6px;
                    margin:3px;
                    border-radius:4px;
                    font-size:11px;
                ">${w}</span>`
            ).join("");
    }

    function highlightText(text, words) {

        let highlighted = text;

        words.forEach(word => {
            const regex = new RegExp("(" + word + ")", "gi");
            highlighted = highlighted.replace(
                regex,
                '<span style="background-color: yellow; font-weight:bold;">$1</span>'
            );
        });

        return highlighted;
    }

});