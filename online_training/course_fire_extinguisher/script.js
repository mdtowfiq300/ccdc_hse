// PDF file location
const url = 'Fire Extinguisher Bangla.pdf';

// Set worker location for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

// State
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;

// Adjust scale depending on screen size
const isMobile = window.innerWidth <= 768;
const scale = isMobile ? 1.6 : 1.2;

// DOM
const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageNumDisplay = document.getElementById('page-num-display');
const loadingIndicator = document.getElementById('loading-indicator');
const navControls = document.getElementById('pdf-nav');
const fullscreenBtn = document.getElementById('fullscreen-btn');

// Render page
const renderPage = (num) => {
  pageRendering = true;
  pdfDoc.getPage(num).then((page) => {
    const viewport = page.getViewport({ scale: scale });
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.height = viewport.height * devicePixelRatio;
    canvas.width = viewport.width * devicePixelRatio;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      transform: [devicePixelRatio, 0, 0, devicePixelRatio, 0, 0],
    };

    page.render(renderContext).promise.then(() => {
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

// Update nav
const updateNavButtons = () => {
  prevButton.disabled = pageNum <= 1;
  nextButton.disabled = pageNum >= pdfDoc.numPages;
};

// Events
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

// Fullscreen (mobile only)
fullscreenBtn.addEventListener('click', () => {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.webkitRequestFullscreen) {
    canvas.webkitRequestFullscreen();
  }
});

// Load PDF
pdfjsLib.getDocument(url).promise
  .then((pdfDoc_) => {
    pdfDoc = pdfDoc_;
    loadingIndicator.style.display = 'none';
    navControls.style.visibility = 'visible';
    renderPage(pageNum);
  })
  .catch((err) => {
    loadingIndicator.textContent =
      '❌ Error: Could not load the PDF. Please check the file path.';
    console.error('Error loading PDF:', err);
  });
