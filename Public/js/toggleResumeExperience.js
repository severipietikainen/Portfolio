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
function loadPDF(language) {
    const url = pdfPaths[language] || pdfPaths["en"]; // Default to English if not found
    const pdfCanvas = document.getElementById("pdf-canvas");
    const pdfViewer = document.getElementById("pdf-viewer");

    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdf.getPage(1).then(page => {
            const context = pdfCanvas.getContext("2d");
            const viewport = page.getViewport({ scale: 1.2 });

            pdfCanvas.width = viewport.width;
            pdfCanvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            page.render(renderContext);
        });
    });
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