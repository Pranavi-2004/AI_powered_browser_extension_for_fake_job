let scanMode = false;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "START_SELECTION_MODE") {
        scanMode = true;
        console.log("HireShield: Scan mode ON");
    }

    if (request.action === "CANCEL_SELECTION") {
        scanMode = false;
        console.log("HireShield: Scan mode OFF");
    }
});

// Capture click
document.addEventListener("click", function (e) {

    if (!scanMode) return;

    // Stop navigation
    e.preventDefault();
    e.stopPropagation();

    setTimeout(() => {

        const descriptionPanel =
            document.querySelector("#jobDescriptionText") ||
            document.querySelector("[data-testid='jobsearch-jobDescriptionText']");

        if (descriptionPanel) {

            const jobText = descriptionPanel.innerText;

            chrome.storage.local.set({ lastJobText: jobText });

            console.log("HireShield: Job captured");

            scanMode = false;
        }

    }, 1000);

}, true);
