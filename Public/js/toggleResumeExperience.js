const resumeButton = document.getElementById('showResume');
const experienceButton = document.getElementById('showExperience');
const resumeContent = document.getElementById('resumeContent');
const experienceContent = document.getElementById('experienceContent');
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfContext = pdfCanvas.getContext('2d');

// Initial PDF URL
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

// Function to load and render the PDF
function loadPDF(url) {
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);  // Clear the canvas before rendering
    pdfjsLib.getDocument(url).promise
        .then(pdf => pdf.getPage(1))
        .then(page => {
            const scale = 2.5;  // You can adjust this scale for a better fit
            const viewport = page.getViewport({ scale: scale });

            // Ensure canvas matches the page size
            pdfCanvas.width = viewport.width;
            pdfCanvas.height = viewport.height;

            // Render the page into the canvas context
            return page.render({ canvasContext: pdfContext, viewport: viewport }).promise;
        })
        .catch(error => console.error("Error loading PDF:", error));
}

// Set the language and update translations and PDF URL
function setLanguage(lang) {
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

            // Add a delay to ensure the page fully loads translations before rendering the PDF
            setTimeout(() => {
                loadPDF(currentPDF);  // Reload the PDF after the delay
            }, 1000);  // Adjust the delay time (1000ms or 1 second) as needed for proper rendering
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