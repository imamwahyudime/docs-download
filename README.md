# Google Drive Protected PDF Downloader (Browser Console Script)

This script allows you to download protected PDFs from Google Drive directly through your browser's developer console.

This script have two varian : **You only need one to use**
- **pdf_download.js :** This is the original script which works perfectly, except for the fact that the documents might be bit blurry (low quality).
- **pdf_download-xlarge.js :** This script is a varian which will fix the blurry document issue, but it has misaligned area when printing the downloaded documents (as tested on my PC)

**⚠️ Important: Make sure all pages are loaded before running the script.**

## Usage

1.  **Google Docs Preparation:**
    * Open the protected PDF in Google Docs.
    * Scroll to the bottom of the document to ensure all pages are fully loaded and rendered within the browser. This is crucial for the script to capture all images.

2.  **Developer Console Execution:**
    * Open your browser's developer tools (F12).
    * Navigate to the "Console" tab.
    * Paste the provided JavaScript code into the console.
    * Press Enter to execute the script.

3.  **Download:**
    * You should get a `download.pdf` file.
    * Enjoy!

## Code Explanation

It leverages jsPDF to convert embedded images within the Google Docs preview into a downloadable PDF.

* **jsPDF Inclusion:**
    * The script dynamically loads the jsPDF library from a CDN using a `<script>` tag.
    * It includes a trustedURL implementation for better browser compatibility.
* **Image Capture and PDF Generation:**
    * The script iterates through all `<img>` elements on the page.
    * It filters for images with `blob:` URLs, which are the rendered PDF pages.
    * For each image, it creates a canvas, draws the image onto the canvas, and extracts the image data as a JPEG.
    * The extracted image data is then added as a page to the PDF using jsPDF's `addImage` method.
    * The script then downloads the complete PDF file.
