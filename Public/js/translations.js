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

            // Update PDF file path
            const pdfPath = lang === 'fi' ? 'assets/documents/CV_fi.pdf' : 'assets/documents/CV_enf.pdf';
            
            // Update download link
            document.querySelector("#resumeContent a").href = pdfPath;

            // Reload PDF Viewer
            loadPDF(pdfPath);
        });
}

// Function to load the PDF
function loadPDF(url) {
    const canvas = document.getElementById('pdf-canvas');
    const context = canvas.getContext('2d');

    // Clear the canvas before loading a new PDF
    context.clearRect(0, 0, canvas.width, canvas.height);

    pdfjsLib.getDocument(url).promise
        .then(pdf => pdf.getPage(1))
        .then(page => {
            const scale = 2.5;
            const viewport = page.getViewport({ scale: scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            return page.render(renderContext).promise;
        })
        .catch(error => {
            console.error("Error loading PDF:", error);
        });
}

// Initialize with English PDF
loadPDF('assets/documents/CV_enf.pdf');
setLanguage('en');

// Update language change buttons
document.querySelector('[onclick="setLanguage(\'fi\')"]').addEventListener('click', () => setLanguage('fi'));
document.querySelector('[onclick="setLanguage(\'en\')"]').addEventListener('click', () => setLanguage('en'));