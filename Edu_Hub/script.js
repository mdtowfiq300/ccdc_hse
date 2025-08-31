// Enable worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

const pdfSelect = document.getElementById("pdf-select");
const viewerContainer = document.getElementById("viewer-container");
const fullscreenBtn = document.getElementById("fullscreen-btn");

// Function to load PDF
async function loadViewer() {
    const selectedValue = pdfSelect.value;
    const screenWidth = window.innerWidth;

    // Clear previous content
    viewerContainer.innerHTML = "";

    if (screenWidth > 768) {
        // Desktop: load PDF in iframe
        const iframe = document.createElement("iframe");
        iframe.src = `${selectedValue}.pdf`;
        iframe.width = "100%";
        iframe.height = "100%";
        iframe.style.border = "none";
        viewerContainer.appendChild(iframe);
    } else {
        // Mobile: render PDF pages as canvas
        try {
            const url = `${selectedValue}.pdf`;
            const loadingTask = pdfjsLib.getDocument(url);
            const pdf = await loadingTask.promise;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1 });

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
            viewerContainer.innerHTML = `<p style="color:red;">Failed to load PDF on mobile.</p>`;
            console.error(err);
        }
    }
}

// Fullscreen functionality (desktop only)
fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        viewerContainer.requestFullscreen().then(() => {
            viewerContainer.classList.add("fullscreen");
        }).catch(err => console.error(err));
    } else {
        document.exitFullscreen().then(() => {
            viewerContainer.classList.remove("fullscreen");
        }).catch(err => console.error(err));
    }
});

// Disable right-click on viewer to make saving harder
viewerContainer.addEventListener("contextmenu", (e) => e.preventDefault());

// Initial load
loadViewer();

// Event listeners
pdfSelect.addEventListener("change", loadViewer);
window.addEventListener("resize", loadViewer);
