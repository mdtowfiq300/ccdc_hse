const pdfSelect = document.getElementById("pdf-select");
const viewerContainer = document.getElementById("viewer-container");

async function loadViewer() {
    const selectedValue = pdfSelect.value;
    const screenWidth = window.innerWidth;

    viewerContainer.innerHTML = "";

    if (screenWidth > 768) {
        // Desktop: load PDF in iframe
        const iframe = document.createElement("iframe");
        iframe.src = `${selectedValue}.pdf`;
        iframe.width = "100%";
        iframe.height = "600px";
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

// Initial load
loadViewer();

// Event listeners
pdfSelect.addEventListener("change", loadViewer);
window.addEventListener("resize", loadViewer);
