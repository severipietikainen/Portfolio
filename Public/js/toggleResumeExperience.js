const resumeButton = document.getElementById('showResume');
const experienceButton = document.getElementById('showExperience');
const resumeContent = document.getElementById('resumeContent');
const experienceContent = document.getElementById('experienceContent');
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfContext = pdfCanvas.getContext('2d');

// Default PDF path (English)
let currentPDF = 'assets/documents/CV_enf.pdf';

// Function to switch content and update button styles
function toggleContent(activeButton, inactiveButton, activeContent, inactiveContent) {
    activeButton.classList.remove('bg-gray-600', 'text-gray-300');
    activeButton.classList.add('bg-gray-900', 'text-white');
    inactiveButton.classList.remove('bg-gray-900', 'text-white');
    inactiveButton.classList.add('bg-gray-600', 'text-gray-300');

    activeContent.classList.remove('hidden');
    inactiveContent.classList.add('hidden');
}

// Event listeners for the buttons
resumeButton.addEventListener('click', function () {
    toggleContent(resumeButton, experienceButton, resumeContent, experienceContent);
});

experienceButton.addEventListener('click', function () {
    toggleContent(experienceButton, resumeButton, experienceContent, resumeContent);
});

// Function to load and render the PDF
function loadPDF(url) {
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height); // Clear previous content

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

// Initialize with the default PDF
loadPDF(currentPDF);

// Modify `setLanguage` function to update PDF
function setLanguage(lang) {
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll("[data-i18n]").forEach(element => {
                const key = element.getAttribute("data-i18n");
                if (data[lang] && data[lang][key]) {
                    element.textContent = data[lang][key];
                }
            });

            // Update the PDF file when language changes
            currentPDF = lang === 'fi' ? 'assets/documents/CV_fi.pdf' : 'assets/documents/CV_enf.pdf';
            document.querySelector("#resumeContent a").href = currentPDF; // Update download link
            loadPDF(currentPDF); // Reload the PDF
        });
}

// Event listeners for language buttons
document.querySelector('[onclick="setLanguage(\'fi\')"]').addEventListener('click', () => setLanguage('fi'));
document.querySelector('[onclick="setLanguage(\'en\')"]').addEventListener('click', () => setLanguage('en'));