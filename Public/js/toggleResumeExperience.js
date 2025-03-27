const resumeButton = document.getElementById('showResume');
const experienceButton = document.getElementById('showExperience');
const resumeContent = document.getElementById('resumeContent');
const experienceContent = document.getElementById('experienceContent');
const pdfCanvas = document.getElementById('pdf-canvas');
const pdfContext = pdfCanvas.getContext('2d');


const pdfPaths = {
    en: 'assets/documents/CV_enf.pdf',
    fi: 'assets/documents/CV_fi.pdf'
};


let currentPDF = pdfPaths.en;


let isRendering = false;

function toggleContent(activeButton, inactiveButton, activeContent, inactiveContent) {
    activeButton.classList.remove('bg-gray-600', 'text-gray-300');
    activeButton.classList.add('bg-gray-900', 'text-white');
    inactiveButton.classList.remove('bg-gray-900', 'text-white');
    inactiveButton.classList.add('bg-gray-600', 'text-gray-300');

    activeContent.classList.remove('hidden');
    inactiveContent.classList.add('hidden');
}

resumeButton.addEventListener('click', function () {
    toggleContent(resumeButton, experienceButton, resumeContent, experienceContent);
});

experienceButton.addEventListener('click', function () {
    toggleContent(experienceButton, resumeButton, experienceContent, resumeContent);
});



function loadPDF(url) {

    if (isRendering) return;

    isRendering = true; 

    pdfContext.clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);

    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdf.getPage(1).then(page => {
            // Increase the scale factor for sharper rendering
            const scale = 2.5;  

            const viewport = page.getViewport({ scale: scale });

            pdfCanvas.width = viewport.width;
            pdfCanvas.height = viewport.height;

            const renderContext = {
                canvasContext: pdfContext,
                viewport: viewport
            };

            page.render(renderContext).promise.then(() => {
               
                isRendering = false;
            }).catch(error => {
                console.error("Error rendering PDF page:", error);
                isRendering = false; 
            });
        }).catch(error => {
            console.error("Error loading PDF page:", error);
            isRendering = false; 
        });
    }).catch(error => {
        console.error("Error loading PDF:", error);
        isRendering = false; 
    });
}


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


            currentPDF = lang === 'fi' ? 'assets/documents/CV_fi.pdf' : 'assets/documents/CV_enf.pdf';


            document.querySelector("#resumeContent a").href = currentPDF;

            loadPDF(currentPDF);
        })
        .catch(error => console.error('Error loading translations:', error));
}


// Language toggle buttons
document.querySelector('[onclick="setLanguage(\'fi\')"]').addEventListener('click', () => setLanguage('fi'));
document.querySelector('[onclick="setLanguage(\'en\')"]').addEventListener('click', () => setLanguage('en'));


setLanguage('en');

// Initial PDF load
loadPDF(currentPDF);