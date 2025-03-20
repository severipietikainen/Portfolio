 // Get the buttons and sections
 const resumeButton = document.getElementById('showResume');
 const experienceButton = document.getElementById('showExperience');
 const resumeContent = document.getElementById('resumeContent');
 const experienceContent = document.getElementById('experienceContent');

 // Function to switch content and update button styles
 function toggleContent(activeButton, inactiveButton, activeContent, inactiveContent) {
     activeButton.classList.remove('bg-gray-600', 'text-gray-300');
     activeButton.classList.add('bg-gray-900', 'text-white');
     inactiveButton.classList.remove('bg-gray-900', 'text-white');
     inactiveButton.classList.add('bg-gray-600', 'text-gray-300');

     activeContent.classList.remove('hidden');
     inactiveContent.classList.add('hidden');
 }

 // Event listeners for the buttons
 resumeButton.addEventListener('click', function () {
     toggleContent(resumeButton, experienceButton, resumeContent, experienceContent);
 });

 experienceButton.addEventListener('click', function () {
     toggleContent(experienceButton, resumeButton, experienceContent, resumeContent);
 });

 const url = 'assets/documents/CV_enf.pdf';
    
 // Load the PDF.js library
 pdfjsLib.getDocument(url).promise.then(function (pdf) {
     pdf.getPage(1).then(function (page) {
         const canvas = document.getElementById('pdf-canvas');
         const context = canvas.getContext('2d');
         
         // Adjust the scale here (1.5 for example)
         const scale = 2.5;  // You can increase or decrease this value to fit the text size you want
         const viewport = page.getViewport({ scale: scale });
         
         // Set the canvas size to the scaled PDF size
         canvas.width = viewport.width;
         canvas.height = viewport.height;

         // Render the page
         page.render({ canvasContext: context, viewport: viewport });
     });
 });