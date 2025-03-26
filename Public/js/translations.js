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