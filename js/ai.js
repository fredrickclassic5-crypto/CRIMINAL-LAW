// ========================================
// GHANA AI LEGAL ASSISTANT
// ========================================


// ========================================
// PAGE ELEMENTS
// ========================================

const askBtn =
    document.getElementById("askBtn");

const questionInput =
    document.getElementById("question");

const answer =
    document.getElementById("answer");

const followUpBox =
    document.getElementById("followUpBox");

const followUpQuestion =
    document.getElementById("followUpQuestion");

const followUpBtn =
    document.getElementById("followUpBtn");


// ========================================
// CONVERSATION CONTEXT
// ========================================

let lastQuestion = "";
let lastResult = null;


// ========================================
// LAW DATABASES
// ========================================

const files = [
    "act29.json",
    "act30.json",
    "evidence.json"
];


// ========================================
// STOP WORDS
// ========================================

const stopWords = [

    "what",
    "what's",
    "is",
    "the",
    "a",
    "an",
    "of",
    "in",
    "on",
    "for",
    "to",
    "and",
    "or",
    "are",
    "under",
    "explain",
    "tell",
    "me",
    "about",
    "please",
    "can",
    "you",
    "does",
    "do",
    "mean",
    "means",
    "how",
    "who",
    "where",
    "which",
    "would",
    "could",
    "should",
    "this",
    "that",
    "it",
    "its"
];


// ========================================
// CLEAN TEXT
// ========================================

function cleanText(text) {

    return String(text || "")
        .toLowerCase()
        .replace(/[?.,!;:()[\]{}"'`]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}


// ========================================
// GET SEARCH WORDS
// ========================================

function getSearchWords(question) {

    return cleanText(question)
        .split(" ")
        .filter(word =>
            !stopWords.includes(word)
        )
        .filter(word =>
            word.length > 2
        );

}


// ========================================
// GET LAW SECTION
// ========================================

function getSection(law) {

    const rawSection =
        law.section ??
        law.sectionNumber ??
        law.number ??
        "";

    const section =
        String(rawSection).trim();

    if (!section) {
        return "";
    }

    if (
        section
            .toLowerCase()
            .startsWith("section")
    ) {

        return section;

    }

    return "Section " + section;

}


// ========================================
// GET LAW TITLE
// ========================================

function getTitle(law) {

    return (
        law.title ||
        law.name ||
        law.heading ||
        "Untitled Section"
    );

}


// ========================================
// GET LAW CONTENT
// ========================================

function getContent(law) {

    return (
        law.content ||
        law.definition ||
        law.description ||
        law.text ||
        ""
    );

}


// ========================================
// SAFE HTML
// ========================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ========================================
// ACT NAME
// ========================================

function getActName(file) {

    if (file === "act29.json") {

        return "Criminal Offences Act, 1960 (Act 29)";

    }


    if (file === "act30.json") {

        return "Criminal and Other Offences (Procedure) Act, 1960 (Act 30)";

    }


    if (file === "evidence.json") {

        return "Evidence Act, 1975 (NRCD 323)";

    }


    return file;

}


// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(title, message) {

    if (!answer) {
        return;
    }

    answer.innerHTML = `

        <div class="dashboard-card">

            <h3>
                ${title}
            </h3>

            <p>
                ${message}
            </p>

        </div>

    `;

}


// ========================================
// SEARCH LAW DATABASE
// ========================================

async function searchLaws(words, useContext = false) {

    let found = [];


    for (const file of files) {

        try {

            const response =
                await fetch(
                    "data/" + file
                );


            if (!response.ok) {

                console.error(
                    "Could not load:",
                    file
                );

                continue;

            }


            const laws =
                await response.json();


            if (!Array.isArray(laws)) {

                console.error(
                    file +
                    " must contain an array."
                );

                continue;

            }


            laws.forEach(law => {

                const title =
                    cleanText(
                        getTitle(law)
                    );


                const content =
                    cleanText(
                        getContent(law)
                    );


                const section =
                    cleanText(
                        getSection(law)
                    );


                const searchableText =
                    title +
                    " " +
                    content +
                    " " +
                    section;


                let score = 0;


                // =================================
                // WORD MATCHING
                // =================================

                words.forEach(word => {

                    if (
                        searchableText.includes(
                            word
                        )
                    ) {

                        score++;

                    }

                });


                // =================================
                // FOLLOW-UP CONTEXT
                // =================================

                if (
                    useContext &&
                    lastResult
                ) {

                    const sameLaw =
                        file === lastResult.source &&
                        Number(law.id) ===
                        Number(lastResult.id);


                    if (sameLaw) {

                        score += 5;

                    }

                }


                if (score > 0) {

                    found.push({

                        ...law,

                        source: file,

                        score: score

                    });

                }

            });


        } catch (error) {

            console.error(
                "Error reading " + file,
                error
            );

        }

    }


    // ========================================
    // SORT
    // ========================================

    found.sort(
        (a, b) =>
            b.score - a.score
    );


    // ========================================
    // REMOVE DUPLICATES
    // ========================================

    const uniqueResults = [];


    found.forEach(law => {

        const exists =
            uniqueResults.some(item =>

                item.source === law.source &&
                Number(item.id) ===
                Number(law.id)

            );


        if (!exists) {

            uniqueResults.push(law);

        }

    });


    return uniqueResults;

}


// ========================================
// DISPLAY RESULTS
// ========================================

function displayResults(results) {

    if (!answer) {
        return;
    }


    if (results.length === 0) {

        answer.innerHTML = `

            <div class="dashboard-card">

                <h3>
                    🔍 No Result Found
                </h3>

                <p>
                    I could not find a matching
                    provision in the available
                    Ghana law databases.
                </p>

                <p>
                    Try searching for:
                </p>

                <p>
                    <strong>murder</strong><br>
                    <strong>robbery</strong><br>
                    <strong>stealing</strong><br>
                    <strong>rape</strong><br>
                    <strong>assault</strong><br>
                    <strong>bail</strong>
                </p>

            </div>

        `;


        if (followUpBox) {

            followUpBox.style.display =
                "none";

        }

        return;

    }


    const topResults =
        results.slice(0, 10);


    // Remember strongest result
    lastResult =
        topResults[0];


    let html = `

        <div class="dashboard-card">

            <h2>
                🤖 Ghana Legal Assistant
            </h2>

            <p>
                I found
                <strong>
                    ${results.length}
                </strong>
                relevant provision(s).
            </p>

        </div>

    `;


    topResults.forEach(law => {

        const section =
            escapeHTML(
                getSection(law)
            );


        const title =
            escapeHTML(
                getTitle(law)
            );


        const content =
            escapeHTML(
                getContent(law)
            );


        const actName =
            escapeHTML(
                getActName(
                    law.source
                )
            );


        html += `

            <div
                class="dashboard-card legal-result"
                data-file="${escapeHTML(law.source)}"
                data-id="${escapeHTML(law.id)}"
            >

                <p>

                    <strong>
                        ${actName}
                    </strong>

                </p>


                <h3>
                    ${section}
                </h3>


                <h2>
                    ${title}
                </h2>


                <h4>
                    📜 Legal Provision
                </h4>


                <p>
                    ${content}
                </p>


                <p class="read-section">

                    📖
                    <strong>
                        Read Full Section →
                    </strong>

                </p>

            </div>

            <br>

        `;

    });


    answer.innerHTML =
        html;


    // ========================================
    // RESULT CLICK EVENTS
    // ========================================

    const resultCards =
        document.querySelectorAll(
            ".legal-result"
        );


    resultCards.forEach(card => {

        card.addEventListener(
            "click",
            function () {

                const file =
                    card.dataset.file;

                const id =
                    card.dataset.id;


                openLaw(
                    file,
                    id
                );

            }
        );

    });


    // ========================================
    // SHOW FOLLOW-UP
    // ========================================

    if (followUpBox) {

        followUpBox.style.display =
            "block";

    }

}


// ========================================
// ASK AI / SEARCH
// ========================================

async function askLegalQuestion(
    useContext = false
) {

    if (!questionInput || !answer) {
        return;
    }


    const question =
        questionInput.value.trim();


    if (!question) {

        showMessage(
            "🤖 AI Legal Assistant",
            "Please enter a legal question."
        );

        return;

    }


    lastQuestion =
        question;


    answer.innerHTML = `

        <div class="dashboard-card">

            <h3>
                🔎 Searching Ghana Laws...
            </h3>

            <p>
                Please wait.
            </p>

        </div>

    `;


    const words =
        getSearchWords(question);


    if (words.length === 0) {

        showMessage(
            "🔎 Search",
            "Please enter a specific legal term or offence."
        );

        return;

    }


    try {

        const results =
            await searchLaws(
                words,
                useContext
            );


        displayResults(
            results
        );


    } catch (error) {

        console.error(
            "AI Search Error:",
            error
        );


        showMessage(
            "⚠️ Search Error",
            "There was a problem searching the law database."
        );

    }

}


// ========================================
// ASK BUTTON
// ========================================

if (askBtn) {

    askBtn.addEventListener(
        "click",
        function () {

            /*
             * A normal question starts
             * a fresh search.
             */
            lastResult = null;

            askLegalQuestion(
                false
            );

        }
    );

}


// ========================================
// ENTER KEY FOR MAIN QUESTION
// ========================================

if (questionInput) {

    questionInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();


                if (askBtn) {

                    askBtn.click();

                }

            }

        }
    );

}


// ========================================
// OPEN LAW READER
// ========================================

function openLaw(file, id) {

    if (!file || !id) {
        return;
    }


    window.location.href =
        "reader.html?file=" +
        encodeURIComponent(file) +
        "&id=" +
        encodeURIComponent(id);

}


// ========================================
// FOLLOW-UP BUTTON
// ========================================

if (followUpBtn) {

    followUpBtn.addEventListener(
        "click",
        function () {

            if (!followUpQuestion) {
                return;
            }


            const question =
                followUpQuestion.value.trim();


            if (!question) {

                alert(
                    "Please enter a follow-up question."
                );

                return;

            }


            /*
             * Keep previous result.
             * This allows the follow-up question
             * to continue from the previous law.
             */

            questionInput.value =
                question;


            askLegalQuestion(
                true
            );


            followUpQuestion.value =
                "";

        }
    );

}


// ========================================
// ENTER KEY FOR FOLLOW-UP
// ========================================

if (followUpQuestion) {

    followUpQuestion.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();


                if (followUpBtn) {

                    followUpBtn.click();

                }

            }

        }
    );

}