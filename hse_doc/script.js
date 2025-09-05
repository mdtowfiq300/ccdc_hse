const webAppUrl = "https://script.google.com/macros/s/AKfycbzACHw1-RACcuUNv5lb3j5NL8SBlIlpcev3psL8k-sWNoqQhHaRfv-iqY9FLvRRdaowdQ/exec";

document.getElementById("searchBtn").addEventListener("click", searchDocs);

async function searchDocs() {
  const typeSelect = document.getElementById("docType");
  const dateInput = document.getElementById("docDate");
  const selectedTypes = Array.from(typeSelect.selectedOptions).map(opt => opt.value);
  const dateVal = dateInput.value;

  if (!dateVal || selectedTypes.length === 0) {
    alert("Please select document type(s) and date.");
    return;
  }

  // Convert date to YYYY-MM-DD
  const date = new Date(dateVal);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}-${mm}-${dd}`;

  try {
    const res = await fetch(webAppUrl, {
      method: "POST",
      body: JSON.stringify({ docTypes: selectedTypes, date: dateStr })
    });
    const data = await res.json();

    // Generate table
    let html = "<table><tr><th>Date</th><th>Type</th><th>Document</th></tr>";
    if (data.length === 0) {
      html += "<tr><td colspan='3'>No files found</td></tr>";
    } else {
      data.forEach(item => {
        html += `<tr>
          <td>${item.date}</td>
          <td>${item.type}</td>
          <td><a class='icon' href='${item.link}' target='_blank'>📄</a></td>
        </tr>`;
      });
    }
    html += "</table>";
    document.getElementById("tableDiv").innerHTML = html;
  } catch (err) {
    console.error(err);
    alert("Error fetching documents. Check console.");
  }
}
