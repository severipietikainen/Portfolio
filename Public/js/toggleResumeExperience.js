const resumeButton = document.getElementById('showResume');
const experienceButton = document.getElementById('showExperience');
const resumeContent = document.getElementById('resumeContent');
const experienceContent = document.getElementById('experienceContent');
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfContext = pdfCanvas.getContext('2d');

// Define PDF paths for English and Finnish
const pdfPaths = {
    en: 'assets/documents/CV_enf.pdf',
    fi: 'assets/documents/CV_fi.pdf'
};

// Set the initial PDF URL to English
let currentPDF = pdfPaths.en;

// Track if a PDF render is in progress
let isRendering = false;

// Function to toggle between Resume and Experience sections
function toggleContent(activeButton, inactiveButton, activeContent, inactiveContent) {
    activeButton.classList.remove('bg-gray-600', 'text-gray-300');
    activeButton.classList.add('bg-gray-900', 'text-white');
    inactiveButton.classList.remove('bg-gray-900', 'text-white');
    inactiveButton.classList.add('bg-gray-600', 'text-gray-300');

    activeContent.classList.remove('hidden');
    inactiveContent.classList.add('hidden');
}

// Event listeners for buttons
resumeButton.addEventListener('click', function () {
    toggleContent(resumeButton, experienceButton, resumeContent, experienceContent);
});

experienceButton.addEventListener('click', function () {
    toggleContent(experienceButton, resumeButton, experienceContent, resumeContent);
});

// Function to load and render the PDF on the canvas
function loadPDF(url) {
    // Avoid starting a new render if one is already in progress
    if (isRendering) return;

    isRendering = true; // Set the flag to indicate rendering is in progress

    // Clear the canvas before rendering the new PDF
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdf.getPage(1).then(page => {
            // Increase the scale factor for sharper rendering
            const scale = 2.5;  // You can increase this value for higher resolution

            const viewport = page.getViewport({ scale: scale });

            pdfCanvas.width = viewport.width;
            pdfCanvas.height = viewport.height;

            const renderContext = {
                canvasContext: pdfContext,
                viewport: viewport
            };

            page.render(renderContext).promise.then(() => {
                // Once the render operation is completed, reset the flag
                isRendering = false;
            }).catch(error => {
                console.error("Error rendering PDF page:", error);
                isRendering = false; // Reset the flag in case of an error
            });
        }).catch(error => {
            console.error("Error loading PDF page:", error);
            isRendering = false; // Reset the flag in case of an error
        });
    }).catch(error => {
        console.error("Error loading PDF:", error);
        isRendering = false; // Reset the flag in case of an error
    });
}

// Function to set language and update the PDF URL
// Function to set language and update the PDF URL and download link
function setLanguage(lang) {
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            const translations = data;

            document.querySelectorAll("[data-i18n]").forEach(element => {
                const key = element.getAttribute("data-i18n");
                if (translations[lang] && translations[lang][key]) {
                    element.textContent = translations[lang][key];
                }
            });

            // Set the English or Finnish PDF URL
            currentPDF = lang === 'fi' ? 'assets/documents/CV_fi.pdf' : 'assets/documents/CV_enf.pdf';

            // Update the download link to the correct PDF based on the language
            document.querySelector("#resumeContent a").href = currentPDF;

            // Reload the PDF after updating the URL
            loadPDF(currentPDF);
        })
        .catch(error => console.error('Error loading translations:', error));
}


// Language toggle buttons
document.querySelector('[onclick="setLanguage(\'fi\')"]').addEventListener('click', () => setLanguage('fi'));
document.querySelector('[onclick="setLanguage(\'en\')"]').addEventListener('click', () => setLanguage('en'));

// Set initial language to English and load the PDF
setLanguage('en');

// Initial PDF load
loadPDF(currentPDF);