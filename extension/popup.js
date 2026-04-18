const API_URL = "http://localhost:5000/api/classify";

const urlInput = document.getElementById("url-input");
const scanCurrentButton = document.getElementById("scan-current");
const scanUrlButton = document.getElementById("scan-url");
const statusText = document.getElementById("status");
const resultPanel = document.getElementById("result");
const riskPill = document.getElementById("risk-pill");
const scoreText = document.getElementById("score");
const summaryText = document.getElementById("summary");
const flagsList = document.getElementById("flags");
const sslText = document.getElementById("ssl");
const domainAgeText = document.getElementById("domain-age");

function setStatus(message) {
  statusText.textContent = message;
}

function setLoading(isLoading) {
  scanCurrentButton.disabled = isLoading;
  scanUrlButton.disabled = isLoading;
  scanCurrentButton.textContent = isLoading ? "Scanning..." : "Use current tab";
  scanUrlButton.textContent = isLoading ? "Please wait" : "Scan now";
}

function resetResult() {
  resultPanel.classList.add("hidden");
  flagsList.innerHTML = "";
}

function riskLabel(risk) {
  if (risk === "danger") return "Malicious";
  if (risk === "warning") return "Suspicious";
  return "Safe";
}

function renderResult(data) {
  const risk = data.risk || "safe";
  resultPanel.classList.remove("hidden");
  riskPill.textContent = riskLabel(risk);
  riskPill.className = `pill ${risk}`;
  scoreText.textContent = `${Math.round(data.score ?? 0)}%`;
  summaryText.textContent = data.summary || "No summary returned by the API.";
  sslText.textContent = data.ssl ? "Valid" : "Missing";
  domainAgeText.textContent = data.domain_age || "Unknown";

  flagsList.innerHTML = "";
  const flags = Array.isArray(data.flags) ? data.flags : [];
  if (!flags.length) {
    const item = document.createElement("li");
    item.textContent = "No additional flags detected.";
    flagsList.appendChild(item);
    return;
  }

  flags.forEach((flag) => {
    const item = document.createElement("li");
    item.textContent = flag;
    flagsList.appendChild(item);
  });
}

async function scanUrl(rawUrl) {
  const url = rawUrl.trim();
  if (!url) {
    setStatus("Enter a URL or use the current tab.");
    resetResult();
    return;
  }

  if (!/^https?:\/\//i.test(url)) {
    setStatus("URL must start with http:// or https://");
    resetResult();
    return;
  }

  setLoading(true);
  setStatus("Sending URL to the classifier...");
  resetResult();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    renderResult(data);
    setStatus(`Scanned ${data.normalized_url || url} successfully.`);
  } catch (error) {
    setStatus(`Scan failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
}

async function fillCurrentTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    const currentUrl = currentTab?.url || "";

    if (!currentUrl || !/^https?:\/\//i.test(currentUrl)) {
      setStatus("Current tab cannot be scanned. Open a normal website tab.");
      return;
    }

    urlInput.value = currentUrl;
    setStatus("Current tab loaded. Click Scan now.");
  } catch (error) {
    setStatus(`Unable to read current tab: ${error.message}`);
  }
}

scanCurrentButton.addEventListener("click", fillCurrentTab);
scanUrlButton.addEventListener("click", () => scanUrl(urlInput.value));
urlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    scanUrl(urlInput.value);
  }
});

fillCurrentTab();