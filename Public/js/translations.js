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
            document.getElementById("resumeDownload").href = pdfPath;

            // Reload PDF Viewer
            loadPDF(pdfPath);
        });
}

// Function to load the PDF
function loadPDF(url) {
    pdfjsLib.getDocument(url).promise.then(function (pdf) {
        pdf.getPage(1).then(function (page) {
            const canvas = document.getElementById('pdf-canvas');
            const context = canvas.getContext('2d');

            const scale = 2.5;
            const viewport = page.getViewport({ scale: scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Fix upside-down issue
            context.save(); // Save the original context state
            context.translate(0, canvas.height); // Move to bottom-left corner
            context.scale(1, -1); // Flip vertically

            // Render the page
            page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                context.restore(); // Restore context after rendering
            });
        });
    });
}

// Initialize with English PDF
loadPDF('assets/documents/CV_enf.pdf');

document.addEventListener("DOMContentLoaded", () => {
    setLanguage('en');
});


document.querySelector('[onclick="setLanguage(\'fi\')"]').addEventListener('click', () => setLanguage('fi'));
document.querySelector('[onclick="setLanguage(\'en\')"]').addEventListener('click', () => setLanguage('en'));