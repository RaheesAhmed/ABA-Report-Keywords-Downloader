function downloadKeywords() {
    // Get the ASINs entered by the user
    var asinInput = document.getElementById("asin-input").value;
    var asins = asinInput.split(",");
  
    // Open a new tab to fetch the ABA report for each ASIN
    for (var i = 0; i < asins.length; i++) {
      var asin = asins[i].trim();
      var url = "https://sellercentral.amazon.com/analytics/aba/report?asin=" + asin;
      chrome.tabs.create({ url: url, active: false }, function(tab) {
        // Wait for the tab to finish loading
        chrome.tabs.onUpdated.addListener(function(tabId, info) {
          if (tabId == tab.id && info.status == "complete") {
            // Get the keywords from the report and download them
            chrome.tabs.executeScript(tabId, { file: "content.js" }, function(results) {
              if (results && results.length > 0) {
                var keywords = results[0];
                downloadCSV(asin + ".csv", keywords);
              }
            });
          }
        });
      });
    }
  }
  
  function downloadCSV(filename, data) {
    var csv = "Keyword\n";
    for (var i = 0; i < data.length; i++) {
      csv += data[i] + "\n";
    }
    var blob = new Blob([csv], { type: "text/csv" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  document.getElementById("download-button").addEventListener("click", downloadKeywords);
  