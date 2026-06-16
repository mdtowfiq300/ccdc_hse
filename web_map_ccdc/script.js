/* ==========================================================================
   1. Base Layout & Reset
   ========================================================================== */
html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f6f9;
    overflow: hidden;
}

/* ==========================================================================
   2. Sidebar Container Layout
   ========================================================================== */
#sidebar {
    position: absolute;
    top: 0;
    left: 0;
    width: 340px;
    height: 100%;
    background: #ffffff;
    box-shadow: 4px 0 15px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
}

.logo-area {
    border-bottom: 2px solid #eef2f5;
    padding-bottom: 15px;
    margin-bottom: 20px;
}

.logo-area h2 {
    margin: 0;
    color: #1a365d;
    font-size: 22px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.logo-area .subtitle {
    margin: 5px 0 0 0;
    color: #718096;
    font-size: 13px;
}

/* ==========================================================================
   3. Dashboard Interactive Components & Cards
   ========================================================================== */
.card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
}

.card h3 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 16px;
    color: #2d3748;
}

.placeholder {
    font-style: italic;
    color: #a0aec0;
    font-size: 13px;
}

/* ==========================================================================
   4. Route Form Inputs & Navigation Controls
   ========================================================================== */
.form-group {
    margin-bottom: 12px;
}

.form-group label {
    display: block;
    font-size: 12px;
    font-weight: bold;
    color: #4a5568;
    margin-bottom: 4px;
}

.map-select {
    width: 100%;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #cbd5e0;
    background-color: #fff;
    font-size: 13px;
    color: #2d3748;
    box-sizing: border-box;
}

.btn-route {
    width: 100%;
    padding: 10px;
    background-color: #1a365d;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 5px;
}

.btn-route:hover {
    background-color: #2b6cb0;
}

#routing-results {
    margin-top: 15px;
}

.route-metric {
    margin: 6px 0;
    font-size: 14px;
    color: #2d3748;
    line-height: 1.4;
}

.route-metric strong {
    color: #1a365d;
}

/* ==========================================================================
   5. Core Map Display Frame & Footer Info
   ========================================================================== */
#map {
    height: 100%;
    width: 100%;
    margin-left: 340px; /* Aligns map canvas perfectly clear of sidebar */
}

.footer {
    margin-top: auto;
    text-align: center;
    font-size: 11px;
    color: #a0aec0;
    border-top: 1px solid #eef2f5;
    padding-top: 10px;
}

/* Custom styling for permanently visible rig map labels */
.leaflet-tooltip.rig-label {
    background-color: #ffffff !important;
    color: #1a365d !important;
    font-weight: bold !important;
    border: 1px solid #1a365d !important;
    border-radius: 4px !important;
    padding: 2px 6px !important;
    box-shadow: 0 1px 5px rgba(0,0,0,0.2) !important;
    font-size: 11px !important;
    opacity: 1 !important;         /* Fixes potential transparency defaults */
    display: block !important;     /* Forces the element framework to draw */
    visibility: visible !important;/* Bypasses structural hidden states */
}

/* Optional: Removes the tiny default speech-bubble arrow underneath the label for a cleaner look */
.leaflet-tooltip-top.rig-label::before {
    border-top-color: #1a365d !important;
}


/* ==========================================================================
   6. Mobile Responsiveness Controls (For Smartphones)
   ========================================================================== */
@media (max-width: 768px) {
    /* Change sidebar to a top banner layout on mobile */
    #sidebar {
        width: 100%;
        height: auto;
        max-height: 45%; /* Keeps control panel covering less than half the screen */
        position: relative;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        overflow-y: auto; /* Allows scrolling inside the forms if text gets long */
        padding: 12px;
    }

    .logo-area {
        margin-bottom: 10px;
        padding-bottom: 5px;
    }

    .logo-area h2 {
        font-size: 18px;
    }

    .card {
        padding: 10px;
        margin-bottom: 8px;
    }

    /* Reset the map layout to fill the remaining screen space below the controls */
    #map {
        margin-left: 0 !important;
        height: 55% !important; /* Allocates the bottom half of the phone screen to the map */
        width: 100%;
    }
}


