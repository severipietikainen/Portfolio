const resumeButton = document.getElementById('showResume');
const experienceButton = document.getElementById('showExperience');
const resumeContent = document.getElementById('resumeContent');
const experienceContent = document.getElementById('experienceContent');
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfContext = pdfCanvas.getContext('2d');

// Set the initial PDF URL to English
let currentPDF = 'assets/documents/CV_enf.pdf';

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
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    pdfjsLib.getDocument(url).promise
        .then(pdf => {
            const numPages = pdf.numPages;
            let currentPage = 1;

            // Render each page
            const renderPage = (pageNumber) => {
                pdf.getPage(pageNumber).then(page => {
                    const scale = 2.5;
                    const viewport = page.getViewport({ scale: scale });

                    // Set canvas size based on page size
                    pdfCanvas.width = viewport.width;
                    pdfCanvas.height = viewport.height;

                    // Render the page
                    page.render({
                        canvasContext: pdfContext,
                        viewport: viewport
                    }).promise.then(() => {
                        // Move to next page
                        currentPage++;
                        if (currentPage <= numPages) {
                            setTimeout(() => renderPage(currentPage), 50); // Small delay between page renders
                        }
                    }).catch(error => console.error("Error rendering page", error));
                }).catch(error => console.error("Error getting page", error));
            };

            renderPage(1); // Start rendering the first page
        })
        .catch(error => console.error("Error loading PDF:", error));
}

// Function to set language and update the PDF URL
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
            currentPDF = lang === 'fi' ? 'assets/documents/CV_enf.pdf' : 'assets/documents/CV_enf.pdf';

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