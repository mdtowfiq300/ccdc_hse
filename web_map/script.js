// ==========================================================================
// 1. Core Map Initialization (Centered tightly on Bangladesh)
// ==========================================================================
const map = L.map('map').setView([23.6850, 90.3563], 7.5);

// Configuration: Directly linked to your operational Google Spreadsheet
const SPREADSHEET_ID = '1HyAr_bnpqf8a5-CHtXPIu2dSxyZupqZFSM5qdF7PH-c';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;



// Add professional OpenStreetMap map tile layers
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Global state variables for logistics management
let locationRegistry = []; 
let routingLine = null; 

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
    locationRegistry = []; // Clear register to handle refreshes cleanly

    // Target the UI dropdown menus
    const startDropdown = document.getElementById('start-location');
    const endDropdown = document.getElementById('end-location');
    
    // Clear initial loading options
    startDropdown.innerHTML = '<option value="">-- Select Origin Site --</option>';
    endDropdown.innerHTML = '<option value="">-- Select Destination Site --</option>';

    // Skip the Excel/Google CSV header row (index 0)
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        
        // Strip out protective string quotation marks
        const cleanLine = lines[i].replace(/"/g, "");
        const columns = cleanLine.split(",");

        const locationName = columns[0].trim();
        const lat = parseFloat(columns[1]);
        const lng = parseFloat(columns[2]);

        if (!isNaN(lat) && !isNaN(lng)) {
            const siteObject = { name: locationName, lat: lat, lng: lng };
            locationRegistry.push(siteObject);

            // Execute map plotting rule
            createRigMarker(siteObject);

            // Populate Form Options for Left Side control panel
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
// 3. Interactive Asset Marker Builder (With Fixed Permanent Text Labels)
// ==========================================================================
function createRigMarker(site) {
    const marker = L.marker([site.lat, site.lng]).addTo(map);
    
    // Clean popup (Removed 'Unit Code:' string prefix)
    marker.bindPopup(`<b>${site.name}</b>`);
    
    // Inject permanent visible layout text tags directly above map asset coordinates
    marker.bindTooltip(site.name, {
        permanent: true,       // Prevents hiding on mouse out
        noHide: true,          // Bypasses default structural close actions
        direction: 'top',      // Locks anchoring configuration above pin graphic
        offset: [0, -10],      // Spacing layout shift
        className: 'rig-label' // References CSS styling file rules overrides
    }).openTooltip();          // Executes open action instantly upon generation
}

// ==========================================================================
// 4. Input Trigger Action Listener (Find Route Button Command)
// ==========================================================================
document.getElementById('btn-find-route').addEventListener('click', function() {
    const startValue = document.getElementById('start-location').value;
    const endValue = document.getElementById('end-location').value;

    if (!startValue || !endValue) {
        alert("Please specify both an Origin and a Destination site to begin processing data.");
        return;
    }

    if (startValue === endValue) {
        alert("Origin and Destination locations match. Please select distinct locations.");
        return;
    }

    // Isolate precise grid coordinate matching profile keys
    const originSite = locationRegistry.find(item => item.name === startValue);
    const destinationSite = locationRegistry.find(item => item.name === endValue);

    if (originSite && destinationSite) {
        calculateLogisticsRoute(originSite, destinationSite);
    }
});

// ==========================================================================
// 5. OSRM Network Evaluation & Automated Map Bounds Calibration
// ==========================================================================
function calculateLogisticsRoute(start, end) {
    const resultsPanel = document.getElementById('routing-results');
    resultsPanel.innerHTML = "Processing infrastructure matrices...";

    // Purge old visual line elements from prior queries
    if (routingLine) {
        map.removeLayer(routingLine);
    }

    // Call open-source routing machine API metrics
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

    fetch(osrmUrl)
        .then(response => response.json())
        .then(data => {
            if (data.code === 'Ok') {
                const routeData = data.routes[0];
                const distanceKm = (routeData.distance / 1000).toFixed(1);
                const durationMinutes = Math.round(routeData.duration / 60);
                
                let timeString = `${durationMinutes} mins`;
                if (durationMinutes > 60) {
                    const hours = Math.floor(durationMinutes / 60);
                    const remainingMins = durationMinutes % 60;
                    timeString = `${hours} hr ${remainingMins} mins`;
                }

                // Render metrics securely to user card layout 
                resultsPanel.innerHTML = `
                    <div class="route-metric"><strong>From:</strong> ${start.name}</div>
                    <div class="route-metric"><strong>To:</strong> ${end.name}</div>
                    <div class="route-metric"><strong>Driving Distance:</strong> ${distanceKm} km</div>
                    <div class="route-metric"><strong>Est. Transit Duration:</strong> ${timeString}</div>
                `;

                // Map coordinates inversion from [Lng, Lat] to standard Leaflet [Lat, Lng]
                const geometry = routeData.geometry;
                const coordinates = geometry.coordinates.map(coord => [coord[1], coord[0]]);
                
                // Draw path line
                routingLine = L.polyline(coordinates, { color: '#2b6cb0', weight: 5, opacity: 0.8 }).addTo(map);
                
                // CRITICAL AUTO-ZOOM: Re-bound screen scale dimensions perfectly around active sites line track path
                map.fitBounds(routingLine.getBounds(), { padding: [50, 50] });

            } else {
                resultsPanel.innerHTML = `<span style="color:#e53e3e;">No viable driving network found between selected locations.</span>`;
            }
        })
        .catch(error => {
            console.error('Routing Engine Failure:', error);
            resultsPanel.innerHTML = `<span style="color:#e53e3e;">API Error computing road parameters.</span>`;
        });
}