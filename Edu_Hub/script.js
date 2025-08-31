// Enable worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

const pdfSelect = document.getElementById("pdf-select");
const viewerContainer = document.getElementById("viewer-container");
const fullscreenBtn = document.getElementById("fullscreen-btn");

async function loadViewer() {
    const selectedValue = pdfSelect.value;
    const url = `${selectedValue}.pdf`;

    // Clear previous content
    viewerContainer.innerHTML = "";

    try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1 });

            // Fit PDF page to container width
            const containerWidth = viewerContainer.clientWidth - 20;
            const scale = containerWidth / viewport.width;
            const scaledViewport = page.getViewport({ scale });

            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;

            viewerContainer.appendChild(canvas);

            await page.render({ canvasContext: context, viewport: scaledViewport }).promise;
        }
    } catch (err) {
        viewerContainer.innerHTML = `<p style="color:red;">Failed to load PDF.</p>`;
        console.error(err);
    }
}

// Fullscreen function
fullscreenBtn.addEventListener("click", () => {
    if (viewerContainer.requestFullscreen) {
        viewerContainer.requestFullscreen();
    } else if (viewerContainer.webkitRequestFullscreen) {
        viewerContainer.webkitRequestFullscreen();
    } else if (viewerContainer.msRequestFullscreen) {
        viewerContainer.msRequestFullscreen();
    }
});

// Initial load
loadViewer();

// Event listeners
pdfSelect.addEventListener("change", loadViewer);
window.addEventListener("resize", loadViewer);

// Disable right-click inside viewer
viewerContainer.addEventListener("contextmenu", (e) => e.preventDefault());
