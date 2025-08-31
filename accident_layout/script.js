document.addEventListener("DOMContentLoaded", function () {
    const monthData = {
       
        
        july: [
            
            { x: 270, y: 305, type: "hand", name: "Md.Manjarul Islam",  accident: "Sustained impact injry on hand while handling lifting sub.",status:"Major" },
           
        ],

        august: [
            { x: 260, y: 275, type: "hand", name: "ABU JAYED BABU", accident: "Sustained impact injry on hand by elevator",status:"Major" },
           
            { x: 740, y: 220, type: "foot", name: "Sawon kazi", id: "", accident: "Fall in hole due to low light ",status:"Minor"  }, 
        ],
       
    };

    let selectedMonth = "";  // Always start empty
    let heatmapVisible = false;

    // Ensure dropdown starts at default option
    document.getElementById("month").value = "";

    function updateMarkers() {
        const accidentData = monthData[selectedMonth];

        if (!accidentData || accidentData.length === 0) {
            alert("No data available for " + selectedMonth);
            return;
        }

        clearMarkersAndTooltips();
        displayMarkers(accidentData);
    }

    document.getElementById("month").addEventListener("change", function () {
        selectedMonth = document.getElementById("month").value;
        if (selectedMonth !== "") {
            updateMarkers();
        } else {
            clearMarkersAndTooltips();
            clearHeatmap();
        }
    });

    document.getElementById("toggleHeatmap").addEventListener("click", function () {
        if (!heatmapVisible) {
            heatmapVisible = true;
            const allAccidentData = Object.values(monthData).flat();
            generateHeatmap(allAccidentData);
        } else {
            heatmapVisible = false;
            clearHeatmap();
            if (selectedMonth !== "") updateMarkers();
        }
    });

    function clearMarkersAndTooltips() {
        document.querySelectorAll(".marker, .tooltip").forEach(el => el.remove());
    }

    function clearHeatmap() {
        const heatmapCanvas = document.querySelector(".heatmap-canvas");
        if (heatmapCanvas) heatmapCanvas.remove();
    }

    function generateHeatmap(accidentData) {
        const imageContainer = document.querySelector(".image-container");
        clearHeatmap();

        const canvas = document.createElement("canvas");
        canvas.width = imageContainer.clientWidth;
        canvas.height = imageContainer.clientHeight;
        canvas.classList.add("heatmap-canvas");
        imageContainer.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        const containerWidth = imageContainer.clientWidth;
        const containerHeight = imageContainer.clientHeight;

        accidentData.forEach(accident => {
            const scaledX = (accident.x / 1000) * containerWidth;
            const scaledY = (accident.y / 500) * containerHeight;
            drawHeatSpot(ctx, scaledX, scaledY);
        });
    }

    function drawHeatSpot(ctx, x, y) {
        const innerRadius = 10, outerRadius = 40;
        const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius);
        gradient.addColorStop(0, "rgba(255, 0, 0, 0.5)");
        gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.1)");
        gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    function displayMarkers(accidentData) {
        const imageContainer = document.querySelector(".image-container");
        const containerWidth = imageContainer.clientWidth;
        const containerHeight = imageContainer.clientHeight;

        accidentData.forEach(accident => {
            const marker = document.createElement("div");
            marker.classList.add("marker");

            const markerX = (accident.x / 1000) * containerWidth;
            const markerY = (accident.y / 500) * containerHeight;

            marker.style.top = `${markerY}px`;
            marker.style.left = `${markerX}px`;

            const markerImage = document.createElement("img");
            markerImage.src = `icons/${accident.type}.png`;
            markerImage.alt = accident.accident;
            marker.appendChild(markerImage);
            imageContainer.appendChild(marker);

            const tooltip = document.createElement("div");
            tooltip.classList.add("tooltip");
            tooltip.style.top = `${markerY + 30}px`;
            tooltip.style.left = `${markerX}px`;
            tooltip.innerHTML = `<b>Name:</b> ${accident.name} <br><b>ID:</b> ${accident.id} <br><b>Accident:</b> ${accident.accident} <br><b>Status:</b> ${accident.status}`;
            imageContainer.appendChild(tooltip);

            marker.addEventListener("click", () => {
                const currentDisplay = tooltip.style.display;
                tooltip.style.display = currentDisplay === "block" ? "none" : "block";
            });
        });
    }
});
