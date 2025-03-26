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

            // Update the PDF based on the selected language
            currentPDF = lang === 'fi' ? 'assets/documents/CV_fi.pdf' : 'assets/documents/CV_enf.pdf';
            document.querySelector("#resumeContent a").href = currentPDF;

            // Reload the PDF immediately after the language change
            loadPDF(currentPDF); 
        })
        .catch(error => console.error('Error loading translations:', error));
}

// Set initial language to English
setLanguage('en');

// Event listeners for language change
document.querySelector('[onclick="setLanguage(\'fi\')"]').addEventListener('click', () => setLanguage('fi'));
document.querySelector('[onclick="setLanguage(\'en\')"]').addEventListener('click', () => setLanguage('en'));