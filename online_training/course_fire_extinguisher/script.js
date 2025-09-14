// PDF file location
const url = 'Fire Extinguisher Bangla.pdf';

// Set worker location for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

// State variables
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
const scale = 1.2;

// DOM elements
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageNumDisplay = document.getElementById('page-num-display');
const loadingIndicator = document.getElementById('loading-indicator');
const navControls = document.getElementById('pdf-nav');

// Render a specific page
const renderPage = (num) => {
  pageRendering = true;
  pdfDoc.getPage(num).then((page) => {
    // Responsive scaling based on screen width
    const viewport = page.getViewport({ scale: scale });
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.height = viewport.height * devicePixelRatio;
    canvas.width = viewport.width * devicePixelRatio;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      transform: [devicePixelRatio, 0, 0, devicePixelRatio, 0, 0],
    };

    const renderTask = page.render(renderContext);
    renderTask.promise.then(() => {
      pageRendering = false;
      if (pageNumPending !== null) {
        renderPage(pageNumPending);
        pageNumPending = null;
      }
      updateNavButtons();
    });
  });

  pageNumDisplay.textContent = `Page ${num} of ${pdfDoc.numPages}`;
};

// Queue render
const queueRenderPage = (num) => {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
};

// Update navigation buttons
const updateNavButtons = () => {
  prevButton.disabled = pageNum <= 1;
  nextButton.disabled = pageNum >= pdfDoc.numPages;
};

// Event listeners
prevButton.addEventListener('click', () => {
  if (pageNum > 1) {
    pageNum--;
    queueRenderPage(pageNum);
  }
});

nextButton.addEventListener('click', () => {
  if (pageNum < pdfDoc.numPages) {
    pageNum++;
    queueRenderPage(pageNum);
  }
});

// Load the PDF
pdfjsLib.getDocument(url).promise
  .then((pdfDoc_) => {
    pdfDoc = pdfDoc_;
    loadingIndicator.style.display = 'none';
    navControls.style.visibility = 'visible';
    renderPage(pageNum);
  })
  .catch((err) => {
    loadingIndicator.textContent =
      'Error: Could not load the PDF document. Please check the file path and CORS settings.';
    console.error('Error loading PDF:', err);
  });
