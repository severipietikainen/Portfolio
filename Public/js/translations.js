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

    // Load the PDF document again with the appropriate URL
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
    // Prevent PDF from loading if the canvas is already busy
    if (pdfCanvas.width === 0 || pdfCanvas.height === 0) {
        console.log('Canvas is not initialized, skipping language change.');
        return;
    }

    // Clear the canvas to avoid rendering the old PDF
    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    // Fetch the translation data
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll("[data-i18n]").forEach(element => {
                const key = element.getAttribute("data-i18n");
                if (data[lang] && data[lang][key]) {
                    element.textContent = data[lang][key];
                }
            });

            // Update the PDF based on the selected language
            currentPDF = lang === 'fi' ? 'assets/documents/CV_fi.pdf' : 'assets/documents/CV_enf.pdf';
            document.querySelector("#resumeContent a").href = currentPDF;

            // Ensure PDF is only loaded when content is ready (with a short delay)
            setTimeout(() => {
                if (resumeVisible) {
                    loadPDF(currentPDF); // Reload the PDF for the selected language
                }
            }, 100); // Adjusted delay to ensure content has been rendered
        });
}

// Event listeners for language change
document.querySelector('[onclick="setLanguage(\'fi\')"]').addEventListener('click', () => setLanguage('fi'));
document.querySelector('[onclick="setLanguage(\'en\')"]').addEventListener('click', () => setLanguage('en'));