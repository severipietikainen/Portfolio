const resumeButton = document.getElementById('showResume');
const experienceButton = document.getElementById('showExperience');
const resumeContent = document.getElementById('resumeContent');
const experienceContent = document.getElementById('experienceContent');
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfContext = pdfCanvas.getContext('2d');

let currentPDF = 'assets/documents/CV_enf.pdf';
let resumeVisible = true;

// Function to toggle between resume and experience content
function toggleContent(activeButton, inactiveButton, activeContent, inactiveContent) {
    activeButton.classList.remove('bg-gray-600', 'text-gray-300');
    activeButton.classList.add('bg-gray-900', 'text-white');
    inactiveButton.classList.remove('bg-gray-900', 'text-white');
    inactiveButton.classList.add('bg-gray-600', 'text-gray-300');

    activeContent.classList.remove('hidden');
    inactiveContent.classList.add('hidden');

    if (activeContent === resumeContent) {
        resumeVisible = true;
        loadPDF(currentPDF); 
    } else {
        resumeVisible = false;
    }
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
    // Clear previous rendering on the canvas
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

// Initially hide the canvas and load PDF when resume section is clicked
pdfCanvas.style.display = "none"; // Hide the canvas initially
loadPDF(currentPDF); // Load the PDF on page load

// Function to handle language change
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

            // Add a delay before reloading the PDF to ensure content updates are completed
            setTimeout(() => {
                if (resumeVisible) {
                    loadPDF(currentPDF);  // Reload the PDF for the selected language
                }
            }, 500);  // Delay by 500ms
        });
}

// Event listeners for language buttons
document.querySelector('[onclick="setLanguage(\'fi\')"]').addEventListener('click', () => setLanguage('fi'));
document.querySelector('[onclick="setLanguage(\'en\')"]').addEventListener('click', () => setLanguage('en'));

// Wait for the page to fully load before showing the canvas to prevent any gray-out or flipping issues
window.addEventListener('load', function () {
    setTimeout(() => {
        if (resumeVisible) {
            pdfCanvas.style.display = "block"; // Show the canvas after the page is fully loaded
            loadPDF(currentPDF); // Reload the PDF to ensure proper rendering
        }
    }, 500); // Delay by 500ms
});