const resumeButton = document.getElementById('showResume');
const experienceButton = document.getElementById('showExperience');
const resumeContent = document.getElementById('resumeContent');
const experienceContent = document.getElementById('experienceContent');
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfContext = pdfCanvas.getContext('2d');

// Initial PDF URL and current language
let currentPDF = 'assets/documents/CV_enf.pdf';
let currentLanguage = 'en'; // Set to the initial language

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

// Function to load and render the PDF
function loadPDF(url) {
    // Ensure the canvas is completely cleared
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
    pdfCanvas.width = pdfCanvas.width; // Reset the canvas width/height

    pdfjsLib.getDocument(url).promise
        .then(pdf => {
            // Get the number of pages in the PDF
            const numPages = pdf.numPages;
            const renderPage = (pageNumber) => {
                pdf.getPage(pageNumber).then(page => {
                    const scale = 2.5;
                    const viewport = page.getViewport({ scale: scale });

                    // Set the canvas width and height according to the page size
                    pdfCanvas.width = viewport.width;
                    pdfCanvas.height = viewport.height;

                    // Render the page into the canvas context
                    return page.render({ canvasContext: pdfContext, viewport: viewport }).promise;
                });
            };

            // Render all pages
            for (let i = 1; i <= numPages; i++) {
                renderPage(i);
            }
        })
        .catch(error => console.error("Error loading PDF:", error));
}

// Set the language and update translations and PDF URL
function setLanguage(lang) {
    // Check if the selected language is already the current language
    if (lang === currentLanguage) return;  // Skip if the language is already set

    // Fetch translations and update the text
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

            // Set the PDF URL based on the selected language
            currentPDF = lang === 'fi' ? 'assets/documents/CV_fi.pdf' : 'assets/documents/CV_enf.pdf';
            document.querySelector("#resumeContent a").href = currentPDF;



            // Update the current language
            currentLanguage = lang;
        })
        .catch(error => console.error('Error loading translations:', error));
}

// Event listeners for language change
document.querySelector('[onclick="setLanguage(\'fi\')"]').addEventListener('click', () => setLanguage('fi'));
document.querySelector('[onclick="setLanguage(\'en\')"]').addEventListener('click', () => setLanguage('en'));

// Set initial language to English
setLanguage('en');

// Initial load of the PDF
loadPDF(currentPDF);