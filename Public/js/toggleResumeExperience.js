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

function loadPDF(url) {
    // Clear the canvas immediately before loading the PDF
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    pdfjsLib.getDocument(url).promise
        .then(pdf => {
            const numPages = pdf.numPages;

            // Render a single page at a time
            const renderPage = (pageNumber) => {
                pdf.getPage(pageNumber).then(page => {
                    const scale = 2.5;
                    const viewport = page.getViewport({ scale: scale });

                    // Set the canvas width and height according to the page size
                    pdfCanvas.width = viewport.width;
                    pdfCanvas.height = viewport.height;

                    // Get the rotation from the page (not the viewport)
                    const rotationAngle = page.rotation || 0; // Handle rotation

                    // If the page is rotated, adjust the rendering context
                    if (rotationAngle === 90 || rotationAngle === 270) {
                        pdfContext.save();
                        pdfContext.translate(viewport.width / 2, viewport.height / 2);
                        pdfContext.rotate(rotationAngle * Math.PI / 180);
                        pdfContext.translate(-viewport.width / 2, -viewport.height / 2);
                    }

                    page.render({
                        canvasContext: pdfContext,
                        viewport: viewport
                    }).promise.then(() => {
                        // If the page was rotated, restore the context after rendering
                        if (rotationAngle === 90 || rotationAngle === 270) {
                            pdfContext.restore(); 
                        }
                    }).catch(error => {
                        console.error("Error rendering page", error);
                    });
                }).catch(error => {
                    console.error("Error getting page", error);
                });
            };

            // Render only the first page or the current page
            renderPage(1);
        })
        .catch(error => {
            console.error("Error loading PDF:", error);
        });
}
// Set the language and update translations and PDF URL
function setLanguage(lang) {
    // Clear the canvas immediately before fetching translations
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

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

            // Immediately reload the PDF after updating translations and URL
            loadPDF(currentPDF);
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