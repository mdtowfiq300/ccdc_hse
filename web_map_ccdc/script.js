// ==========================================================================
// 1. Core Map Initialization (Centered tightly on Bangladesh)
// ==========================================================================
const map = L.map('map').setView([23.6850, 90.3563], 7.5);

// Configuration: Google Spreadsheet Source
const SPREADSHEET_ID = '1td2iKejQaRw8Gxd71sPGebj_-0lTCOKPra_D9_3-t9c';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;

// OpenStreetMap tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors © CARTO',
    maxZoom: 20
}).addTo(map);

// Global state
let locationRegistry = [];
let routingLine = null;

// ==========================================================================
// ✈️ Airport Icon Definition
// ==========================================================================
const airportIcon = L.icon({
    iconUrl: 'airport.png',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -12]
});

// ==========================================================================
// ✈️ Fixed Airport Markers (Dhaka + Sylhet)
// ==========================================================================
L.marker([23.8433, 90.3978], { icon: airportIcon })
    .addTo(map)
    .bindPopup("<b>Hazrat Shahjalal International Airport (Dhaka)</b>")
    .bindTooltip("Dhaka Airport", { permanent: true, direction: "top" });

L.marker([24.9633, 91.8668], { icon: airportIcon })
    .addTo(map)
    .bindPopup("<b>Osmani International Airport (Sylhet)</b>")
    .bindTooltip("Sylhet Airport", { permanent: true, direction: "top" });

// ==========================================================================
// 2. Data Fetch Stream & CSV Parser Engine
// ==========================================================================
fetch(SHEET_URL)
    .then(response => response.text())
    .then(csvText => {
        parseAndPlotCSV(csvText);
    })
    .catch(err => {
        console.error("Error loading Google Sheet data:", err);
        alert("Failed to fetch live rig data from Google Sheets.");
    });

function parseAndPlotCSV(text) {
    const lines = text.split("\n");
    locationRegistry = [];

    const startDropdown = document.getElementById('start-location');
    const endDropdown = document.getElementById('end-location');

    startDropdown.innerHTML = '<option value="">-- Select Origin Site --</option>';
    endDropdown.innerHTML = '<option value="">-- Select Destination Site --</option>';

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;

        const cleanLine = lines[i].replace(/"/g, "");
        const columns = cleanLine.split(",");

        const locationName = columns[0].trim();
        const lat = parseFloat(columns[1]);
        const lng = parseFloat(columns[2]);

        if (!isNaN(lat) && !isNaN(lng)) {
            const siteObject = { name: locationName, lat, lng };
            locationRegistry.push(siteObject);

            createRigMarker(siteObject);

            const optionStart = document.createElement('option');
            optionStart.value = locationName;
            optionStart.textContent = locationName;
            startDropdown.appendChild(optionStart);

            const optionEnd = document.createElement('option');
            optionEnd.value = locationName;
            optionEnd.textContent = locationName;
            endDropdown.appendChild(optionEnd);
        }
    }
}

// ==========================================================================
// 3. Rig Marker Builder
// ==========================================================================
function createRigMarker(site) {
    const marker = L.marker([site.lat, site.lng]).addTo(map);

    marker.bindPopup(`<b>${site.name}</b>`);

    marker.bindTooltip(site.name, {
        permanent: true,
        noHide: true,
        direction: 'top',
        offset: [0, -10],
        className: 'rig-label'
    }).openTooltip();
}

// ==========================================================================
// 4. Route Button Listener
// ==========================================================================
document.getElementById('btn-find-route').addEventListener('click', function () {
    const startValue = document.getElementById('start-location').value;
    const endValue = document.getElementById('end-location').value;

    if (!startValue || !endValue) {
        alert("Please select both origin and destination.");
        return;
    }

    if (startValue === endValue) {
        alert("Origin and destination cannot be the same.");
        return;
    }

    const originSite = locationRegistry.find(i => i.name === startValue);
    const destinationSite = locationRegistry.find(i => i.name === endValue);

    if (originSite && destinationSite) {
        calculateLogisticsRoute(originSite, destinationSite);
    }
});

// ==========================================================================
// 5. OSRM Routing Engine
// ==========================================================================
function calculateLogisticsRoute(start, end) {
    const resultsPanel = document.getElementById('routing-results');
    resultsPanel.innerHTML = "Processing route...";

    if (routingLine) {
        map.removeLayer(routingLine);
    }

    const osrmUrl =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${start.lng},${start.lat};${end.lng},${end.lat}` +
        `?overview=full&geometries=geojson`;

    fetch(osrmUrl)
        .then(res => res.json())
        .then(data => {
            if (data.code !== 'Ok') {
                resultsPanel.innerHTML = `<span style="color:red;">No route found.</span>`;
                return;
            }

            const route = data.routes[0];
            const distanceKm = (route.distance / 1000).toFixed(1);
            const durationMin = Math.round(route.duration / 60);

            let timeString = `${durationMin} mins`;
            if (durationMin > 60) {
                const h = Math.floor(durationMin / 60);
                const m = durationMin % 60;
                timeString = `${h} hr ${m} mins`;
            }

            resultsPanel.innerHTML = `
                <div><b>From:</b> ${start.name}</div>
                <div><b>To:</b> ${end.name}</div>
                <div><b>Distance:</b> ${distanceKm} km</div>
                <div><b>Duration:</b> ${timeString}</div>
            `;

            const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);

            routingLine = L.polyline(coords, {
                color: '#2b6cb0',
                weight: 5,
                opacity: 0.8
            }).addTo(map);

            map.fitBounds(routingLine.getBounds(), {
                padding: [50, 50]
            });
        })
        .catch(err => {
            console.error(err);
            resultsPanel.innerHTML = `<span style="color:red;">Routing error.</span>`;
        });
}

