let currentPDF = 'assets/documents/CV_enf.pdf';
let resumeVisible = true;

const resumeButton = document.getElementById('showResume');
const experienceButton = document.getElementById('showExperience');
const resumeContent = document.getElementById('resumeContent');
const experienceContent = document.getElementById('experienceContent');
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfContext = pdfCanvas.getContext('2d');

// Toggle between Resume and Experience content
function toggleContent(activeButton, inactiveButton, activeContent, inactiveContent) {
    activeButton.classList.remove('bg-gray-600', 'text-gray-300');
    activeButton.classList.add('bg-gray-900', 'text-white');
    inactiveButton.classList.remove('bg-gray-900', 'text-white');
    inactiveButton.classList.add('bg-gray-600', 'text-gray-300');

    activeContent.classList.remove('hidden');
    inactiveContent.classList.add('hidden');

    if (activeContent === resumeContent) {
        resumeVisible = true;
        loadPDF(currentPDF);  // Reload the PDF when switching to resume
    } else {
        resumeVisible = false;
    }
}

// Load and render the PDF
function loadPDF(url) {
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);  // Clear the canvas before rendering the new PDF

    pdfjsLib.getDocument(url).promise
        .then(pdf => pdf.getPage(1))
        .then(page => {
            const scale = 2.5;
            const viewport = page.getViewport({ scale: scale });

            pdfCanvas.width = viewport.width;
            pdfCanvas.height = viewport.height;

            return page.render({ canvasContext: pdfContext, viewport: viewport }).promise;
        })
        .catch(error => console.error("Error loading PDF:", error));
}

// Handle language change
function setLanguage(lang) {
    // Clear the canvas immediately
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll("[data-i18n]").forEach(element => {
                const key = element.getAttribute("data-i18n");
                if (data[lang] && data[lang][key]) {
                    element.textContent = data[lang][key];
                }
            });

            // Update PDF based on selected language
            currentPDF = lang === 'fi' ? 'assets/documents/CV_fi.pdf' : 'assets/documents/CV_enf.pdf';
            document.querySelector("#resumeContent a").href = currentPDF;

            // Reload the PDF immediately after the language change
            if (resumeVisible) {
                loadPDF(currentPDF);
            }
        })
        .catch(error => console.error('Error loading translations:', error));
}

// Event listeners for toggling content visibility
resumeButton.addEventListener('click', function () {
    toggleContent(resumeButton, experienceButton, resumeContent, experienceContent);
});

experienceButton.addEventListener('click', function () {
    toggleContent(experienceButton, resumeButton, experienceContent, resumeContent);
});

// Event listeners for language change
document.querySelector('[onclick="setLanguage(\'fi\')"]').addEventListener('click', () => setLanguage('fi'));
document.querySelector('[onclick="setLanguage(\'en\')"]').addEventListener('click', () => setLanguage('en'));

// Wait for the page to load before showing the canvas
window.addEventListener('load', function () {
    setTimeout(() => {
        if (resumeVisible) {
            pdfCanvas.style.display = "block";  // Show the canvas after the page is fully loaded
            loadPDF(currentPDF);  // Reload the PDF to ensure proper rendering
        }
    }, 500);  // Delay by 500ms
});