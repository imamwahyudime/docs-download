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
let jspdfScript = document.createElement("script");
jspdfScript.onload = function () {

  // --- Configuration Parameters ---
  const maxWidth = 445;    // Max physical width on PDF page (in jsPDF 'px' units)
  const jpegQuality = 0.85; // ADJUST THIS: Start higher (0.85-0.9). Lower reduces size but may blur.
  // --- End Configuration Parameters ---

  let elements = document.getElementsByTagName("img");
  let validImages = []; // Store valid images first

  for (let i = 0; i < elements.length; i++) {
      let img = elements[i];
      if (/^blob:/.test(img.src) && img.naturalWidth > 0 && img.naturalHeight > 0) {
          validImages.push(img);
      }
  }

  if (validImages.length === 0) {
    console.log("No valid blob images found to process.");
    return;
  }

  let pdf; // Declare pdf outside the loop.

  for (let i = 0; i < validImages.length; i++) {
    let img = validImages[i];

    // 1. Use FULL natural dimensions for the canvas source
    let canvasElement = document.createElement('canvas');
    canvasElement.width = img.naturalWidth;  // Use original width
    canvasElement.height = img.naturalHeight; // Use original height
    let con = canvasElement.getContext("2d");
    // Draw the image at its original size onto the canvas
    con.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);

    // 2. Generate JPEG data with controlled quality from the full-res canvas
    let imgData = canvasElement.toDataURL("image/jpeg", jpegQuality); // Control quality here

    // 3. Calculate the physical dimensions for the PDF page layout (same as Code 1)
    let pdfWidth = img.naturalWidth;
    let pdfHeight = img.naturalHeight;

    // Scale down layout dimensions if width exceeds maxWidth
    if (pdfWidth > maxWidth) {
      pdfHeight = (maxWidth / pdfWidth) * pdfHeight;
      pdfWidth = maxWidth;
    }

    // 4. Initialize PDF or add page using the calculated physical layout dimensions
    if (i === 0) {
      pdf = new jsPDF({
          orientation: pdfWidth > pdfHeight ? 'l' : 'p',
          unit: 'px',
          format: [pdfWidth, pdfHeight] // Page size matches desired image display size
      });
    } else {
      pdf.addPage([pdfWidth, pdfHeight], pdfWidth > pdfHeight ? 'l' : 'p');
    }

    // 5. Add the image data to the PDF, letting jsPDF scale it to fit the page dimensions
    // Source data (imgData) is high-res (but compressed), target area is pdfWidth/Height.
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
  }

  // Download the generated PDF.
  if (pdf) {
    pdf.save("download_revised_quality.pdf"); // New filename
  } else {
    console.log("PDF object could not be created.");
  }
};
jspdfScript.src = trustedURL;
document.body.appendChild(jspdfScript);
