let trustedURL;
if (window.trustedTypes && trustedTypes.createPolicy) {
  const policy = trustedTypes.createPolicy('myPolicy', {
    createScriptURL: (input) => {
      return input;
    }
  });
  trustedURL = policy.createScriptURL('https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js');
} else {
  trustedURL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js';
}

// Load the jsPDF library using the trusted URL.
let jspdf = document.createElement("script");
jspdf.onload = function () {
  // Generate a PDF from images with "blob:" sources.
  let elements = document.getElementsByTagName("img");
  const maxWidth = 445; // Set your maximum width here

  if (elements.length === 0) {
    return; //Exit if there are no images.
  }

  let pdf; //Declare pdf outside loop.

  for (let i = 0; i < elements.length; i++) {
    let img = elements[i];
    if (!/^blob:/.test(img.src)) {
      continue;
    }
    let canvasElement = document.createElement('canvas');
    let con = canvasElement.getContext("2d");
    canvasElement.width = img.naturalWidth;
    canvasElement.height = img.naturalHeight;
    con.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
    let imgData = canvasElement.toDataURL("image/jpeg", 1.0);

    let pdfWidth = img.naturalWidth;
    let pdfHeight = img.naturalHeight;

    // Scale down if width exceeds maxWidth
    if (pdfWidth > maxWidth) {
      pdfHeight = (maxWidth / pdfWidth) * pdfHeight;
      pdfWidth = maxWidth;
    }

    // Create jsPDF object on the first image, setting page size.
    if (i === 0) {
      pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? 'l' : 'p', // Landscape or portrait
          unit: 'px',
          format: [pdfWidth, pdfHeight]
      });
    } else {
      pdf.addPage([pdfWidth, pdfHeight], pdfWidth > pdfHeight ? 'l' : 'p');
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  }

  // Download the generated PDF.
  pdf.save("download.pdf");
};
jspdf.src = trustedURL;
document.body.appendChild(jspdf);
