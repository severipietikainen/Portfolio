let currentPDF = 'assets/documents/CV_enf.pdf';
let resumeVisible = true;

function toggleContent(activeButton, inactiveButton, activeContent, inactiveContent) {
    activeButton.classList.remove('bg-gray-600', 'text-gray-300');
    activeButton.classList.add('bg-gray-900', 'text-white');
    inactiveButton.classList.remove('bg-gray-900', 'text-white');
    inactiveButton.classList.add('bg-gray-600', 'text-gray-300');

    activeContent.classList.remove('hidden');
    inactiveContent.classList.add('hidden');

    if (activeContent === resumeContent) {
        resumeVisible = true;
        loadPDF(currentPDF); // Reload the PDF when switching to resume
    } else {
        resumeVisible = false;
    }
}

function loadPDF(url) {
    // Clear the previous PDF from the canvas before reloading
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

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

function setLanguage(lang) {
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            // Update translated content
            document.querySelectorAll("[data-i18n]").forEach(element => {
                const key = element.getAttribute("data-i18n");
                if (data[lang] && data[lang][key]) {
                    element.textContent = data[lang][key];
                }
            });

            // Update the current PDF path based on the selected language
            currentPDF = lang === 'fi' ? 'assets/documents/CV_fi.pdf' : 'assets/documents/CV_enf.pdf';
            document.querySelector("#resumeContent a").href = currentPDF;

            // Add a longer delay before reloading the PDF to ensure content updates are finished
            setTimeout(() => {
                if (resumeVisible) {
                    loadPDF(currentPDF);  // Reload the PDF for the selected language
                }
            }, 1000); // Delay by 1000ms (1 second)
        });
}

// Event listeners for language change
document.querySelector('[onclick="setLanguage(\'fi\')"]').addEventListener('click', () => setLanguage('fi'));
document.querySelector('[onclick="setLanguage(\'en\')"]').addEventListener('click', () => setLanguage('en'));