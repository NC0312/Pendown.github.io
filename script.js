// Catching commonly used elements to minimize dom queries
const livePreviewFrame = document.getElementById('live-preview');
const htmlEditor = document.getElementById('html');
const cssEditor = document.getElementById('css');
const jsEditor = document.getElementById('js');

// Function to set up the live preview iframe and include necessary scripts
function initializeLivePreview() {
    livePreviewFrame.contentWindow.document.body.innerHTML = '';
    const styleElement = document.createElement('style');
    styleElement.setAttribute('id', 'live-preview-style');
    livePreviewFrame.contentWindow.document.head.appendChild(styleElement);

    const pagedJsScript = document.createElement('script');
    pagedJsScript.src = 'https://unpkg.com/pagedjs/dist/paged.legacy.polyfill.js';
    livePreviewFrame.contentWindow.document.head.appendChild(pagedJsScript);
}

// Function to update the live preview iframe with the html code from editor
function updateLiveHTMLPreview(codeEditors) {
    livePreviewFrame.contentWindow.document.body.innerHTML = codeEditors.html.getValue();
}

// Function to update the live preview iframe with the css code from editor
function updateLiveCSSPreview(codeEditors) {
    const styleElement = livePreviewFrame.contentWindow.document.getElementById('live-preview-style');
    styleElement.innerHTML = codeEditors.css.getValue();
}

// Function to update the live preview iframe with the js code from editor
function updateLiveJSPreview(codeEditors) {
    const scriptElement = document.createElement('script');
    scriptElement.innerHTML = codeEditors.js.getValue();
    livePreviewFrame.contentWindow.document.body.appendChild(scriptElement);
}

// Function to initialize CodeMirror editors for html, css and javascript
function initializeCodeEditors() {
    function getDefaultOptions(object) {
        const defaultOptions = {
            lineNumbers: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            theme: 'panda-syntax'
        };
        if (object) {
            const keys = Object.keys(object);
            for (const key of keys) {
                defaultOptions[key] = object[key];
            }
        }
        return defaultOptions;
    }

    const codeEditors = {
        html: CodeMirror(htmlEditor, getDefaultOptions({
            mode: 'text/html',
            value: '',
        })),
        css: CodeMirror(cssEditor, getDefaultOptions({
            mode: 'css',
            value: '',
            extraKeys: { 'Ctrl-Space': 'autocomplete' },
            hintOptions: {
                completeSingle: false,
                closeOnUnfocus: false
            }
        })),
        js: CodeMirror(jsEditor, getDefaultOptions({
            mode: 'javascript',
            value: ''
        })),
    };
    return codeEditors;
}

// Function to set up the live preview studio with CodeMirror editors and event listeners
function setupLivePreviewStudio() {
    const codeEditors = initializeCodeEditors();

    // Event listener for changes in HTML editor
    CodeMirror.on(codeEditors.html, 'change', () => {
        updateLiveHTMLPreview(codeEditors);
    });

    // Event listener for changes in CSS editor
    CodeMirror.on(codeEditors.css, 'change', () => {
        updateLiveCSSPreview(codeEditors);
    });

    // Event listener for changes in HTML editor
    CodeMirror.on(codeEditors.js, 'change', () => {
        updateLiveJSPreview(codeEditors);
    });
}

// Event listener to set up the live preview studio after the dom is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeLivePreview();
    setupLivePreviewStudio();
});





// Get the necessary elements
const codeBox = document.querySelector('.code-box');
const preview = document.querySelector('.preview');
const handle = document.getElementById('drag-handle');

// Set initial heights for code box and preview
let codeBoxHeight = codeBox.offsetHeight;
let previewHeight = preview.offsetHeight;

// Function to handle the drag
function drag(e) {
    const newCodeBoxHeight = codeBoxHeight + e.clientY - startY;
    const newPreviewHeight = previewHeight - e.clientY + startY;

    codeBox.style.height = `${newCodeBoxHeight}px`;
    preview.style.height = `${newPreviewHeight}px`;
}

// Function to end dragging
function endDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', endDrag);
}

let startY;
handle.addEventListener('mousedown', (e) => {
    startY = e.clientY;
    codeBoxHeight = codeBox.offsetHeight;
    previewHeight = preview.offsetHeight;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
});
