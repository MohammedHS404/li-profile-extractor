document.getElementById('extractButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractProfiles
  });
});

function extractProfiles() {
  // Your original code wrapped in a function
  const toCSV = (data) => {
    const csvRows = [];
    const headers = ["Name", "Title", "Current", "Location", "Profile URL"];
    csvRows.push(headers.join(","));
    data.forEach(row => {
      csvRows.push(row.map(val => `"${val}"`).join(","));
    });
    return csvRows.join("\n");
  };

  const saveCSV = (data, filename = "linkedin_profiles.csv") => {
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const extractedProfiles = [];

  document.querySelectorAll(".KTFkSmBsFiTakUskYzRRttbsRKpwUqQBGWLss").forEach(profile => {
    let name = profile.querySelector("a[href*='linkedin.com/in'] span[aria-hidden='true']")?.innerText || "";
    let title = profile.querySelector(".wYqQQrAssqySWkRKiEeCRBSojQuRYgic")?.innerText || "";
    let current = profile.querySelector("p.entity-result__summary--2-lines strong")?.innerText || "";
    let location = profile.querySelector(".fdFsuoIEaDmDhLQhinTwYZqfClTHklvH")?.innerText || "";
    let profileUrl = profile.querySelector("a[href*='linkedin.com/in']")?.href || "";
    
    extractedProfiles.push([name, title, current, location, profileUrl]);
  });

  const csvData = toCSV(extractedProfiles);
  saveCSV(csvData);
}