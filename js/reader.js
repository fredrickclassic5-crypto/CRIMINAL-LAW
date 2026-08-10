const params = new URLSearchParams(window.location.search);

const file = params.get("file");
const id = Number(params.get("id"));

let laws = [];
let currentIndex = -1;
let currentLaw = null;


// ========================================
// LOAD LAW DATABASE
// ========================================

async function loadLaw() {

    try {

        if (!file) {
            throw new Error("No law file specified.");
        }

        const response = await fetch("data/" + file);

        if (!response.ok) {
            throw new Error("Could not load " + file);
        }

        laws = await response.json();

        if (!Array.isArray(laws)) {
            throw new Error("The JSON file must contain an array of laws.");
        }

        currentIndex = laws.findIndex(
            item => Number(item.id) === id
        );

        if (currentIndex === -1) {

            document.getElementById("sectionTitle").textContent =
                "Section not found";

            document.getElementById("lawTitle").textContent = "";

            document.getElementById("lawText").textContent =
                "The requested section could not be found.";

            return;
        }

        currentLaw = laws[currentIndex];

        displayLaw();

    } catch (error) {

        console.error("Reader error:", error);

        document.getElementById("sectionTitle").textContent =
            "Error";

        document.getElementById("lawTitle").textContent = "";

        document.getElementById("lawText").textContent =
            error.message;
    }
}


// ========================================
// DISPLAY LAW
// ========================================

function displayLaw() {

    const section =
        currentLaw.section ??
        currentLaw.sectionNumber ??
        currentLaw.number ??
        "";

    const title =
        currentLaw.title ??
        currentLaw.name ??
        currentLaw.heading ??
        "";

    const content =
        currentLaw.content ??
        currentLaw.definition ??
        currentLaw.description ??
        currentLaw.text ??
        "";


    // ========================================
    // FIX SECTION DISPLAY
    // ========================================

    let sectionDisplay = "";

    if (section !== "") {

        const sectionText = String(section).trim();

        // If JSON already says "Section 1",
        // keep it exactly as it is.
        if (
            sectionText
                .toLowerCase()
                .startsWith("section")
        ) {

            sectionDisplay = sectionText;

        } else {

            // If JSON only contains "1",
            // convert it to "Section 1".
            sectionDisplay = "Section " + sectionText;
        }
    }


    // ========================================
    // DISPLAY LAW
    // ========================================

    document.getElementById("sectionTitle").textContent =
        sectionDisplay;

    document.getElementById("lawTitle").textContent =
        title;

    document.getElementById("lawText").textContent =
        content;

    updateNavigation();
}


// ========================================
// PREVIOUS / NEXT
// ========================================

function updateNavigation() {

    const prevBtn =
        document.getElementById("prevBtn");

    const nextBtn =
        document.getElementById("nextBtn");

    if (prevBtn) {

        prevBtn.disabled =
            currentIndex <= 0;
    }

    if (nextBtn) {

        nextBtn.disabled =
            currentIndex >= laws.length - 1;
    }
}


function openSection(index) {

    if (index < 0 || index >= laws.length) {
        return;
    }

    const nextLaw = laws[index];

    window.location.href =
        "reader.html?file=" +
        encodeURIComponent(file) +
        "&id=" +
        encodeURIComponent(nextLaw.id);
}


// ========================================
// PREVIOUS BUTTON
// ========================================

const prevBtn =
    document.getElementById("prevBtn");

if (prevBtn) {

    prevBtn.addEventListener("click", function () {

        openSection(currentIndex - 1);

    });
}


// ========================================
// NEXT BUTTON
// ========================================

const nextBtn =
    document.getElementById("nextBtn");

if (nextBtn) {

    nextBtn.addEventListener("click", function () {

        openSection(currentIndex + 1);

    });
}


// ========================================
// BOOKMARK
// ========================================

const bookmarkBtn =
    document.getElementById("bookmarkBtn");

if (bookmarkBtn) {

    bookmarkBtn.addEventListener("click", function () {

        if (!currentLaw) {
            return;
        }

        let bookmarks =
            JSON.parse(
                localStorage.getItem("bookmarks")
            ) || [];

        const exists = bookmarks.some(item =>
            Number(item.id) === Number(currentLaw.id) &&
            item.file === file
        );

        if (!exists) {

            bookmarks.push({
                ...currentLaw,
                file: file
            });

            localStorage.setItem(
                "bookmarks",
                JSON.stringify(bookmarks)
            );

            alert("Law bookmarked successfully.");

        } else {

            alert("This law is already bookmarked.");

        }

    });
}


// ========================================
// PDF BUTTON
// ========================================

const pdfBtn =
    document.getElementById("pdfBtn");

if (pdfBtn) {

    pdfBtn.addEventListener("click", function () {

        if (!file) {
            return;
        }

        /*
         * Example:
         *
         * act29.json
         * becomes
         * act29.json.pdf
         *
         * if that is the actual filename in your PDF folder.
         */

        let pdfName;

        if (file === "act29.json") {

            pdfName = "act29.json.pdf";

        } else if (file === "act30.json") {

            pdfName = "act30.pdf.pdf";

        } else {

            pdfName =
                file.replace(".json", ".pdf");
        }

        const pdfPath =
            "pdf/" + pdfName;

        console.log("Opening PDF:", pdfPath);

        window.open(
            pdfPath,
            "_blank"
        );

    });
}


// ========================================
// READ ALOUD
// ========================================

const readBtn =
    document.getElementById("readBtn");

const stopBtn =
    document.getElementById("stopBtn");


if (readBtn) {

    readBtn.addEventListener("click", function () {

        if (!currentLaw) {
            return;
        }

        window.speechSynthesis.cancel();


        const section =
            currentLaw.section ??
            currentLaw.sectionNumber ??
            currentLaw.number ??
            "";


        const title =
            currentLaw.title ??
            currentLaw.name ??
            currentLaw.heading ??
            "";


        const content =
            currentLaw.content ??
            currentLaw.definition ??
            currentLaw.description ??
            currentLaw.text ??
            "";


        // Create proper section wording
        let sectionSpeech = "";

        if (section !== "") {

            const sectionText =
                String(section).trim();

            if (
                sectionText
                    .toLowerCase()
                    .startsWith("section")
            ) {

                sectionSpeech = sectionText;

            } else {

                sectionSpeech =
                    "Section " + sectionText;
            }
        }


        const speechText =
            sectionSpeech +
            ". " +
            title +
            ". " +
            content;


        const speech =
            new SpeechSynthesisUtterance(
                speechText
            );


        speech.rate = 0.9;
        speech.pitch = 1;
        speech.volume = 1;


        window.speechSynthesis.speak(
            speech
        );

    });
}


// ========================================
// STOP READING
// ========================================

if (stopBtn) {

    stopBtn.addEventListener("click", function () {

        window.speechSynthesis.cancel();

    });
}


// ========================================
// START READER
// ========================================

loadLaw();