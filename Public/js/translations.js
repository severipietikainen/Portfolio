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
        });

 
    const pdfPaths = {
        en: "assets/documents/CV_enf.pdf",
        fi: "assets/documents/CV_fi.pdf"
    };

    loadPDF(pdfPaths[lang] || pdfPaths["en"]); 
    document.getElementById("resumeDownload").href = pdfPaths[lang] || pdfPaths["en"];
}


function loadPDF(pdfUrl) {
    const canvas = document.getElementById("pdf-canvas");
    if (!canvas) return;

    pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
        pdf.getPage(1).then(function (page) {
            const context = canvas.getContext("2d");
            const scale = 2.5; 
            const viewport = page.getViewport({ scale: scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            page.render({ canvasContext: context, viewport: viewport });
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {
    setLanguage('en');
});


document.querySelector('[onclick="setLanguage(\'fi\')"]').addEventListener('click', () => setLanguage('fi'));
document.querySelector('[onclick="setLanguage(\'en\')"]').addEventListener('click', () => setLanguage('en'));