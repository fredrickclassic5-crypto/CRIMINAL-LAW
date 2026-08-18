// ========================================
// SMART GLOBAL GHANA LAW SEARCH
// MODERN LEGAL RESEARCH VERSION
// DATABASE-GROUNDED AI ANSWERS
// ========================================


// ========================================
// ELEMENTS
// ========================================

const searchInput =
    document.getElementById("globalSearchInput");

const searchButton =
    document.getElementById("globalSearchButton");

const resultsContainer =
    document.getElementById("globalSearchResults");

const searchStatus =
    document.getElementById("searchStatus");

const aiLegalAnswer =
    document.getElementById("aiLegalAnswer");


// ========================================
// LAW DATABASES
// ========================================

const lawFiles = [
    "act29.json",
    "act30.json",
    "evidence.json"
];


// ========================================
// ACTIVE LAW FILTER
// ========================================

let selectedLawFilter =
    window.selectedLawFilter || "all";


// ========================================
// STOP WORDS
// ========================================

const stopWords = new Set([

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
    "tell",
    "me",
    "explain",
    "please"
]);


// ========================================
// ESCAPE HTML
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
// HIGHLIGHT SEARCH WORDS
// ========================================

function highlightText(text, words) {

    let safeText =
        escapeHTML(text);

    if (!words.length) {

        return safeText;

    }


    words.forEach(word => {

        if (!word) {

            return;

        }


        const escapedWord =
            word.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );


        const regex =
            new RegExp(
                `(${escapedWord})`,
                "gi"
            );


        safeText =
            safeText.replace(
                regex,
                "<mark>$1</mark>"
            );

    });


    return safeText;

}


// ========================================
// GET SECTION
// ========================================

function getSection(law) {

    const rawSection =
        law.section ||
        law.sectionNumber ||
        law.number ||
        "";


    if (!rawSection) {

        return "Section";

    }


    const section =
        String(rawSection).trim();


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
// GET TITLE
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
// GET CONTENT
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
// GET ACT SHORT NAME
// ========================================

function getActShortName(file) {

    if (file === "act29.json") {

        return "ACT 29";

    }


    if (file === "act30.json") {

        return "ACT 30";

    }


    if (file === "evidence.json") {

        return "NRCD 323";

    }


    return "GHANA LAW";

}


// ========================================
// GET ACT NAME
// ========================================

function getActName(file) {

    if (file === "act29.json") {

        return "Criminal Offences Act, 1960";

    }


    if (file === "act30.json") {

        return "Criminal and Other Offences (Procedure) Act, 1960";

    }


    if (file === "evidence.json") {

        return "Evidence Act, 1975";

    }


    return file;

}


// ========================================
// QUESTION TYPE DETECTION
// ========================================

function detectQuestionType(question) {

    const text =
        question
            .toLowerCase()
            .trim();


    // PUNISHMENT

    if (
        text.includes("punishment") ||
        text.includes("penalty") ||
        text.includes("sentence") ||
        text.includes("jail") ||
        text.includes("imprisonment") ||
        text.includes("fine") ||
        text.includes("punished")
    ) {

        return "punishment";

    }


    // SECTION

    if (
        text.includes("which section") ||
        text.includes("what section") ||
        text.includes("section") ||
        text.includes("provision")
    ) {

        return "section";

    }


    // PROCEDURE

    if (
        text.includes("procedure") ||
        text.includes("process") ||
        text.includes("court") ||
        text.includes("trial") ||
        text.includes("proceedings") ||
        text.includes("how is") ||
        text.includes("how can")
    ) {

        return "procedure";

    }


    // OFFENCE

    if (
        text.includes("offence") ||
        text.includes("offense") ||
        text.includes("crime") ||
        text.includes("charged") ||
        text.includes("guilty") ||
        text.includes("conviction")
    ) {

        return "offence";

    }


    // DEFINITION

    if (
        text.includes("what is") ||
        text.includes("what does") ||
        text.includes("define") ||
        text.includes("definition") ||
        text.includes("meaning of") ||
        text.includes("means")
    ) {

        return "definition";

    }


    return "general";

}


// ========================================
// QUESTION TYPE LABEL
// ========================================

function getQuestionTypeLabel(type) {

    if (type === "definition") {

        return "Definition Search";

    }


    if (type === "punishment") {

        return "Punishment Search";

    }


    if (type === "section") {

        return "Section Search";

    }


    if (type === "procedure") {

        return "Procedure Search";

    }


    if (type === "offence") {

        return "Offence Search";

    }


    return "General Legal Search";

}


// ========================================
// RELEVANCE LABEL
// ========================================

function getRelevance(score) {

    if (score >= 35) {

        return {
            label: "Highly Relevant",
            icon: "🔥"
        };

    }


    if (score >= 20) {

        return {
            label: "Very Relevant",
            icon: "⭐"
        };

    }


    if (score >= 10) {

        return {
            label: "Relevant",
            icon: "✓"
        };

    }


    return {
        label: "Related",
        icon: "•"
    };

}


// ========================================
// CLEAN QUERY
// ========================================

function cleanSearchQuery(query) {

    return query
        .toLowerCase()
        .replace(
            /[?.,!;:()[\]{}"'`]/g,
            " "
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


// ========================================
// GET SEARCH WORDS
// ========================================

function getSearchWords(query) {

    return query
        .split(/\s+/)
        .filter(word =>
            word.length > 2
        )
        .filter(word =>
            !stopWords.has(word)
        );

}


// ========================================
// GENERATE AI LEGAL ANSWER
// ========================================
//
// IMPORTANT:
// This is database-grounded.
// It does NOT invent legal information.
// It summarizes the strongest matching
// provision already found in your JSON files.
// ========================================

function generateLegalAnswer(
    law,
    question,
    questionType
) {

    if (!law) {

        return;

    }


    if (!aiLegalAnswer) {

        return;

    }


    const title =
        getTitle(law);


    const section =
        getSection(law);


    const content =
        getContent(law);


    const actName =
        getActName(law.source);


    const actShort =
        getActShortName(law.source);


    let explanation = "";


    // ========================================
    // DEFINITION ANSWER
    // ========================================

    if (
        questionType === "definition"
    ) {

        explanation =
            `The database identifies this provision as <strong>${escapeHTML(title)}</strong>. ` +
            `The relevant legal text provides the definition or description contained in this provision.`;

    }


    // ========================================
    // PUNISHMENT ANSWER
    // ========================================

    else if (
        questionType === "punishment"
    ) {

        explanation =
            `The relevant provision is <strong>${escapeHTML(title)}</strong>. ` +
            `The database text below contains the applicable punishment, penalty or sentencing information associated with this provision.`;

    }


    // ========================================
    // SECTION ANSWER
    // ========================================

    else if (
        questionType === "section"
    ) {

        explanation =
            `The strongest matching provision for your question is <strong>${escapeHTML(section)}</strong>, ` +
            `titled <strong>${escapeHTML(title)}</strong>.`;

    }


    // ========================================
    // PROCEDURE ANSWER
    // ========================================

    else if (
        questionType === "procedure"
    ) {

        explanation =
            `The database returned <strong>${escapeHTML(section)}</strong> ` +
            `under the <strong>${escapeHTML(actName)}</strong>. ` +
            `The provision below contains the relevant procedural information.`;

    }


    // ========================================
    // OFFENCE ANSWER
    // ========================================

    else if (
        questionType === "offence"
    ) {

        explanation =
            `The strongest matching offence-related provision is ` +
            `<strong>${escapeHTML(title)}</strong> under ` +
            `<strong>${escapeHTML(actName)}</strong>.`;

    }


    // ========================================
    // GENERAL ANSWER
    // ========================================

    else {

        explanation =
            `The strongest matching provision found in the Ghana legal database is ` +
            `<strong>${escapeHTML(title)}</strong> under ` +
            `<strong>${escapeHTML(actName)}</strong>.`;

    }


    // ========================================
    // PROVISION PREVIEW
    // ========================================

    const answerPreview =
        content.length > 650
            ? content.substring(0, 650) + "..."
            : content;


    // ========================================
    // DISPLAY AI ANSWER
    // ========================================

    aiLegalAnswer.style.display =
        "block";


    aiLegalAnswer.innerHTML = `

        <div
            style="
                background:
                    linear-gradient(
                        135deg,
                        #071f3d,
                        #123d70
                    );
                color:white;
                border-radius:22px;
                padding:28px;
                margin-bottom:30px;
                box-shadow:
                    0 15px 40px
                    rgba(7,31,61,.16);
                position:relative;
                overflow:hidden;
            "
        >

            <div
                style="
                    position:absolute;
                    right:20px;
                    top:10px;
                    font-size:80px;
                    opacity:.06;
                "
            >
                ⚖️
            </div>


            <div
                style="
                    display:flex;
                    align-items:center;
                    gap:12px;
                    margin-bottom:18px;
                "
            >

                <div
                    style="
                        width:48px;
                        height:48px;
                        border-radius:14px;
                        background:rgba(255,255,255,.12);
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:25px;
                    "
                >
                    🤖
                </div>


                <div>

                    <p
                        style="
                            margin:0;
                            color:#f4c542;
                            font-size:11px;
                            font-weight:800;
                            letter-spacing:1.2px;
                        "
                    >
                        AI LEGAL ANSWER
                    </p>


                    <h2
                        style="
                            margin:4px 0 0;
                            font-size:22px;
                            color:white;
                        "
                    >
                        Database-Grounded Answer
                    </h2>

                </div>

            </div>


            <div
                style="
                    background:rgba(255,255,255,.08);
                    border:1px solid rgba(255,255,255,.12);
                    border-radius:15px;
                    padding:18px;
                    margin-bottom:18px;
                "
            >

                <p
                    style="
                        margin:0;
                        color:#dbe6f3;
                        line-height:1.7;
                        font-size:14px;
                    "
                >

                    ${explanation}

                </p>

            </div>


            <div
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:8px;
                    margin-bottom:18px;
                "
            >

                <span
                    style="
                        background:#d9a400;
                        color:#071f3d;
                        padding:6px 10px;
                        border-radius:7px;
                        font-size:11px;
                        font-weight:800;
                    "
                >

                    ${escapeHTML(actShort)}

                </span>


                <span
                    style="
                        background:rgba(255,255,255,.1);
                        color:#dbe6f3;
                        padding:6px 10px;
                        border-radius:7px;
                        font-size:11px;
                    "
                >

                    ${escapeHTML(section)}

                </span>


                <span
                    style="
                        background:rgba(255,255,255,.1);
                        color:#dbe6f3;
                        padding:6px 10px;
                        border-radius:7px;
                        font-size:11px;
                    "
                >

                    ${escapeHTML(
                        getQuestionTypeLabel(
                            questionType
                        )
                    )}

                </span>

            </div>


            <div>

                <p
                    style="
                        margin:0 0 8px;
                        color:#f4c542;
                        font-size:11px;
                        font-weight:800;
                        letter-spacing:1px;
                        text-transform:uppercase;
                    "
                >

                    Relevant Legal Provision

                </p>


                <h3
                    style="
                        margin:0 0 10px;
                        color:white;
                        font-size:18px;
                    "
                >

                    ${escapeHTML(title)}

                </h3>


                <p
                    style="
                        margin:0;
                        color:#cbd7e6;
                        font-size:13px;
                        line-height:1.7;
                    "
                >

                    ${escapeHTML(answerPreview)}

                </p>

            </div>


            <div
                style="
                    margin-top:20px;
                    padding-top:15px;
                    border-top:
                        1px solid
                        rgba(255,255,255,.12);
                "
            >

                <p
                    style="
                        margin:0;
                        color:#aebfd2;
                        font-size:11px;
                    "
                >

                    ⚠️ This answer is generated from
                    the legal provisions currently
                    available in your database.
                    It is not a substitute for advice
                    from a qualified legal professional.

                </p>

            </div>

        </div>

    `;

}


// ========================================
// HIDE AI ANSWER
// ========================================

function hideLegalAnswer() {

    if (!aiLegalAnswer) {

        return;

    }


    aiLegalAnswer.style.display =
        "none";


    aiLegalAnswer.innerHTML =
        "";

}


// ========================================
// SEARCH LAWS
// ========================================

async function searchLaws() {

    if (
        !searchInput ||
        !resultsContainer
    ) {

        return;

    }


    // ========================================
    // SYNC FILTER
    // ========================================

    selectedLawFilter =
        window.selectedLawFilter ||
        selectedLawFilter ||
        "all";


    const query =
        searchInput.value
            .toLowerCase()
            .trim();


    // ========================================
    // EMPTY SEARCH
    // ========================================

    if (!query) {

        hideLegalAnswer();


        resultsContainer.innerHTML = `

            <div class="loading-card">

                <div class="loading-icon">
                    🔎
                </div>

                <h3>
                    Search Ghana Laws
                </h3>

                <p>
                    Enter a legal term, offence,
                    section or keyword above.
                </p>

            </div>

        `;


        if (searchStatus) {

            searchStatus.innerHTML =
                "";

        }


        return;

    }


    // ========================================
    // QUESTION TYPE
    // ========================================

    const questionType =
        detectQuestionType(query);


    // ========================================
    // LOADING
    // ========================================

    hideLegalAnswer();


    if (searchStatus) {

        searchStatus.innerHTML = `

            <div
                style="
                    color:#718096;
                    padding:10px 0;
                "
            >

                🔎 Searching Ghana Laws...

                <p
                    style="
                        margin-top:5px;
                        font-size:12px;
                    "
                >

                    Analysing your legal question
                    against the database.

                </p>

            </div>

        `;

    }


    resultsContainer.innerHTML =
        "";


    // ========================================
    // CLEAN QUERY
    // ========================================

    const cleanQuery =
        cleanSearchQuery(query);


    // ========================================
    // SEARCH WORDS
    // ========================================

    const words =
        getSearchWords(
            cleanQuery
        );


    if (!words.length) {

        if (searchStatus) {

            searchStatus.innerHTML =
                "";

        }


        resultsContainer.innerHTML = `

            <div class="loading-card">

                <div class="loading-icon">
                    🔍
                </div>

                <h3>
                    Be more specific
                </h3>

                <p>

                    Try a legal term such as
                    <strong>murder</strong>,
                    <strong>stealing</strong>,
                    <strong>robbery</strong>
                    or
                    <strong>assault</strong>.

                </p>

            </div>

        `;

        return;

    }


    let results = [];


    // ========================================
    // SEARCH DATABASES
    // ========================================

    for (const file of lawFiles) {


        // ====================================
        // FILTER
        // ====================================

        if (
            selectedLawFilter !== "all" &&
            file !== selectedLawFilter
        ) {

            continue;

        }


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
                    " is not an array."
                );

                continue;

            }


            laws.forEach(law => {

                const title =
                    String(
                        getTitle(law)
                    ).toLowerCase();


                const content =
                    String(
                        getContent(law)
                    ).toLowerCase();


                const section =
                    String(
                        getSection(law)
                    ).toLowerCase();


                const searchableText =
                    title +
                    " " +
                    content +
                    " " +
                    section;


                let score = 0;


                // ====================================
                // WORD MATCHING
                // ====================================

                words.forEach(word => {


                    // Exact title

                    if (
                        title === word
                    ) {

                        score += 20;

                    }


                    // Title starts with word

                    else if (
                        title.startsWith(word)
                    ) {

                        score += 12;

                    }


                    // Title contains word

                    else if (
                        title.includes(word)
                    ) {

                        score += 8;

                    }


                    // Section match

                    if (
                        section.includes(word)
                    ) {

                        score += 5;

                    }


                    // Content match

                    if (
                        content.includes(word)
                    ) {

                        score += 2;

                    }

                });


                // ====================================
                // EXACT PHRASE
                // ====================================

                if (
                    searchableText.includes(
                        cleanQuery
                    )
                ) {

                    score += 20;

                }


                // ====================================
                // EXACT TITLE
                // ====================================

                if (
                    title === cleanQuery
                ) {

                    score += 30;

                }


                // ====================================
                // QUESTION RANKING
                // ====================================


                // DEFINITION

                if (
                    questionType === "definition"
                ) {

                    if (
                        title === cleanQuery
                    ) {

                        score += 40;

                    }


                    if (
                        title.includes(
                            cleanQuery
                        )
                    ) {

                        score += 20;

                    }


                    if (
                        content.includes(
                            "a person who"
                        )
                    ) {

                        score += 5;

                    }

                }


                // PUNISHMENT

                if (
                    questionType === "punishment"
                ) {

                    const punishmentWords = [

                        "punishment",
                        "penalty",
                        "sentence",
                        "imprisonment",
                        "fine",
                        "liable",
                        "punished"

                    ];


                    punishmentWords.forEach(
                        word => {

                            if (
                                content.includes(word)
                            ) {

                                score += 8;

                            }

                        }
                    );

                }


                // SECTION

                if (
                    questionType === "section"
                ) {

                    if (
                        section.includes(
                            cleanQuery
                        )
                    ) {

                        score += 20;

                    }


                    if (
                        title.includes(
                            cleanQuery
                        )
                    ) {

                        score += 15;

                    }

                }


                // PROCEDURE

                if (
                    questionType === "procedure"
                ) {

                    const procedureWords = [

                        "procedure",
                        "court",
                        "trial",
                        "proceedings",
                        "application",
                        "arrest",
                        "charge",
                        "hearing"

                    ];


                    procedureWords.forEach(
                        word => {

                            if (
                                content.includes(word)
                            ) {

                                score += 6;

                            }

                        }
                    );

                }


                // OFFENCE

                if (
                    questionType === "offence"
                ) {

                    const offenceWords = [

                        "offence",
                        "offense",
                        "crime",
                        "guilty",
                        "charged",
                        "conviction"

                    ];


                    offenceWords.forEach(
                        word => {

                            if (
                                content.includes(word)
                            ) {

                                score += 5;

                            }

                        }
                    );

                }


                // ====================================
                // ADD RESULT
                // ====================================

                if (score > 0) {

                    results.push({

                        ...law,

                        source: file,

                        score: score

                    });

                }

            });


        } catch (error) {

            console.error(
                "Search error:",
                file,
                error
            );

        }

    }


    // ========================================
    // SORT
    // ========================================

    results.sort(
        (a, b) =>
            b.score - a.score
    );


    // ========================================
    // REMOVE DUPLICATES
    // ========================================

    const uniqueResults = [];


    results.forEach(result => {

        const exists =
            uniqueResults.some(item =>

                item.source ===
                result.source &&

                String(item.id) ===
                String(result.id)

            );


        if (!exists) {

            uniqueResults.push(
                result
            );

        }

    });


    // ========================================
    // CLEAR STATUS
    // ========================================

    if (searchStatus) {

        searchStatus.innerHTML =
            "";

    }


    // ========================================
    // NO RESULTS
    // ========================================

    if (
        uniqueResults.length === 0
    ) {

        hideLegalAnswer();


        resultsContainer.innerHTML = `

            <div class="loading-card">

                <div class="loading-icon">
                    🔍
                </div>

                <h3>
                    No results found
                </h3>

                <p>

                    We couldn't find a matching
                    provision in the selected
                    Ghana law database.

                </p>

                <p>

                    Try:
                    <strong>murder</strong>,
                    <strong>stealing</strong>,
                    <strong>robbery</strong>,
                    <strong>rape</strong>,
                    <strong>assault</strong>
                    or
                    <strong>bail</strong>.

                </p>

            </div>

        `;

        return;

    }


    // ========================================
    // TOP RESULT
    // ========================================

    const topResult =
        uniqueResults[0];


    // ========================================
    // GENERATE AI LEGAL ANSWER
    // ========================================

    generateLegalAnswer(
        topResult,
        query,
        questionType
    );


    // ========================================
    // RESULT COUNT
    // ========================================

    const filterName =
        selectedLawFilter === "all"
            ? "All Ghana Laws"
            : getActName(
                selectedLawFilter
            );


    if (searchStatus) {

        searchStatus.innerHTML = `

            <div
                style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    gap:15px;
                    flex-wrap:wrap;
                    margin-bottom:20px;
                "
            >

                <div>

                    <p
                        style="
                            margin:0;
                            color:#718096;
                        "
                    >

                        🔎 Found

                        <strong>
                            ${uniqueResults.length}
                        </strong>

                        relevant provision(s)

                    </p>


                    <p
                        style="
                            margin:6px 0 0;
                            color:#a0aec0;
                            font-size:12px;
                        "
                    >

                        ${escapeHTML(
                            getQuestionTypeLabel(
                                questionType
                            )
                        )}

                    </p>

                </div>


                <span
                    style="
                        background:#fff8dc;
                        color:#a87900;
                        padding:7px 12px;
                        border-radius:20px;
                        font-size:12px;
                        font-weight:700;
                    "
                >

                    ${escapeHTML(filterName)}

                </span>

            </div>

        `;

    }


    // ========================================
    // TOP 30 RESULTS
    // ========================================

    const resultsToShow =
        uniqueResults.slice(
            0,
            30
        );


    // ========================================
    // DISPLAY RESULTS
    // ========================================

    resultsToShow.forEach(
        (law, index) => {

        const card =
            document.createElement("div");


        card.className =
            "modern-law-card";


        const section =
            getSection(law);


        const title =
            getTitle(law);


        const content =
            getContent(law);


        const preview =
            content.length > 220
                ? content.substring(
                    0,
                    220
                ) + "..."
                : content;


        const relevance =
            getRelevance(
                law.score
            );


        const highlightedTitle =
            highlightText(
                title,
                words
            );


        const highlightedPreview =
            highlightText(
                preview,
                words
            );


        card.innerHTML = `

            <div class="law-card-top">

                <div class="law-icon">
                    ⚖️
                </div>


                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:8px;
                    "
                >

                    <span
                        style="
                            background:#fff8dc;
                            color:#9b7200;
                            padding:5px 9px;
                            border-radius:15px;
                            font-size:11px;
                            font-weight:800;
                        "
                    >

                        ${relevance.icon}
                        ${relevance.label}

                    </span>


                    <span class="law-arrow">
                        →
                    </span>

                </div>

            </div>


            <div class="law-card-content">


                <!-- ACT -->

                <div
                    style="
                        display:flex;
                        align-items:center;
                        gap:8px;
                        margin-bottom:10px;
                        flex-wrap:wrap;
                    "
                >

                    <span
                        style="
                            background:#071f3d;
                            color:white;
                            padding:5px 9px;
                            border-radius:6px;
                            font-size:11px;
                            font-weight:800;
                            letter-spacing:.5px;
                        "
                    >

                        ${getActShortName(
                            law.source
                        )}

                    </span>


                    <span
                        style="
                            color:#718096;
                            font-size:12px;
                        "
                    >

                        ${escapeHTML(
                            getActName(
                                law.source
                            )
                        )}

                    </span>

                </div>


                <!-- SECTION -->

                <p
                    style="
                        margin:0 0 5px;
                        color:#a87900;
                        font-size:13px;
                        font-weight:800;
                    "
                >

                    ${escapeHTML(section)}

                </p>


                <!-- TITLE -->

                <h2 class="law-title">

                    ${highlightedTitle}

                </h2>


                <!-- PROVISION -->

                <p
                    style="
                        margin-top:12px;
                        margin-bottom:6px;
                        font-size:12px;
                        font-weight:800;
                        color:#718096;
                        text-transform:uppercase;
                        letter-spacing:.5px;
                    "
                >

                    📜 Legal Provision

                </p>


                <p class="law-action">

                    ${highlightedPreview}

                </p>


                <!-- RESULT NUMBER -->

                <p
                    style="
                        margin-top:12px;
                        color:#a0aec0;
                        font-size:11px;
                    "
                >

                    Result ${index + 1}

                </p>


                <!-- ACTION -->

                <p
                    style="
                        margin-top:12px;
                        color:#d9a400;
                        font-weight:800;
                    "
                >

                    📖 Read Full Section →

                </p>


            </div>

        `;


        // ====================================
        // OPEN READER
        // ====================================

        card.addEventListener(
            "click",
            function() {

                openLaw(
                    law.source,
                    law.id
                );

            }
        );


        resultsContainer.appendChild(
            card
        );

    });

}


// ========================================
// OPEN LAW READER
// ========================================

function openLaw(
    file,
    id
) {

    window.location.href =
        "reader.html?file=" +
        encodeURIComponent(file) +
        "&id=" +
        encodeURIComponent(id);

}


// ========================================
// SEARCH BUTTON
// ========================================

if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchLaws
    );

}


// ========================================
// ENTER KEY
// ========================================

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                searchLaws();

            }

        }
    );

}


// ========================================
// SEARCH HINT BUTTONS
// ========================================

document
    .querySelectorAll(".search-hint")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                if (!searchInput) {

                    return;

                }


                searchInput.value =
                    button.dataset.search;


                searchLaws();

            }
        );

    });


// ========================================
// LAW FILTER BUTTONS
// ========================================

document
    .querySelectorAll(".law-filter")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(
                        ".law-filter"
                    )
                    .forEach(
                        function(filter) {

                            filter.classList.remove(
                                "active"
                            );

                        }
                    );


                button.classList.add(
                    "active"
                );


                selectedLawFilter =
                    button.dataset.filter;


                window.selectedLawFilter =
                    selectedLawFilter;


                if (
                    searchInput &&
                    searchInput.value.trim()
                ) {

                    searchLaws();

                }

            }
        );

    });


// ========================================
// LOAD SEARCH FROM URL
// ========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const urlQuery =
    urlParams.get("q");


if (
    urlQuery &&
    searchInput
) {

    searchInput.value =
        urlQuery;


    setTimeout(
        function() {

            searchLaws();

        },
        150
    );

}


// ========================================
// MAKE FUNCTIONS AVAILABLE
// ========================================

window.searchLaws =
    searchLaws;

window.openLaw =
    openLaw;

window.detectQuestionType =
    detectQuestionType;

window.generateLegalAnswer =
    generateLegalAnswer;
    // ========================================
// SMART LEGAL ANSWER
// ========================================

function generateLegalAnswer(query, results) {

    const answerBox =
        document.getElementById("aiLegalAnswer");

    if (!answerBox) {
        return;
    }

    if (!results || !results.length) {

        answerBox.style.display = "none";
        answerBox.innerHTML = "";

        return;
    }

    const topResults =
        results.slice(0, 5);

    const best =
        topResults[0];

    const title =
        getTitle(best);

    const section =
        getSection(best);

    const content =
        getContent(best);

    const act =
        getActName(best.source);

    const questionType =
        detectQuestionType(query);


    let answer = "";


    // ========================================
    // DEFINITION
    // ========================================

    if (
        questionType === "definition"
    ) {

        answer =
            `Based on the relevant provision in ${act}, ` +
            `${title} is addressed under ${section}. ` +
            `The provision states: ${content}`;

    }


    // ========================================
    // PUNISHMENT
    // ========================================

    else if (
        questionType === "punishment"
    ) {

        answer =
            `The relevant Ghanaian legal provision ` +
            `concerning the punishment or penalty is ` +
            `${section} of ${act}. ` +
            `The provision states: ${content}`;

    }


    // ========================================
    // SECTION
    // ========================================

    else if (
        questionType === "section"
    ) {

        answer =
            `The provision most relevant to your ` +
            `question is ${section} of ${act}, titled ` +
            `"${title}".`;

    }


    // ========================================
    // PROCEDURE
    // ========================================

    else if (
        questionType === "procedure"
    ) {

        answer =
            `The relevant procedural provision is ` +
            `${section} of ${act}. ` +
            `It provides: ${content}`;

    }


    // ========================================
    // OFFENCE
    // ========================================

    else if (
        questionType === "offence"
    ) {

        answer =
            `The relevant offence provision is ` +
            `${section} of ${act}, titled ` +
            `"${title}". ` +
            `The provision states: ${content}`;

    }


    // ========================================
    // GENERAL
    // ========================================

    else {

        answer =
            `The strongest matching provision is ` +
            `${section} of ${act}, titled ` +
            `"${title}". ` +
            `The provision states: ${content}`;

    }


    // ========================================
    // RELATED PROVISIONS
    // ========================================

    let relatedHTML = "";

    if (topResults.length > 1) {

        relatedHTML = `

            <div class="ai-related">

                <h4>
                    📚 Related Provisions
                </h4>

                <div class="ai-related-list">

                    ${topResults
                        .slice(1)
                        .map(item => `

                            <div class="ai-related-item">

                                <strong>
                                    ${escapeHTML(
                                        getSection(item)
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        getTitle(item)
                                    )}
                                </span>

                            </div>

                        `)
                        .join("")}

                </div>

            </div>

        `;

    }


    // ========================================
    // DISPLAY ANSWER
    // ========================================

    answerBox.innerHTML = `

        <div class="ai-answer-header">

            <div class="ai-answer-icon">
                ⚖️
            </div>

            <div>

                <span class="ai-answer-label">
                    LEGAL RESEARCH ANSWER
                </span>

                <h3>
                    Ghana Law Search Result
                </h3>

            </div>

        </div>


        <div class="ai-answer-body">

            <p class="ai-answer-text">
                ${escapeHTML(answer)}
            </p>


            <div class="ai-source-box">

                <div>
                    <strong>
                        📜 Source
                    </strong>
                </div>

                <div>
                    ${escapeHTML(act)}
                </div>

                <div>
                    ${escapeHTML(section)}
                </div>

            </div>


            ${relatedHTML}


            <div class="ai-disclaimer">

                <strong>
                    ⚠️ Legal Research Notice
                </strong>

                <p>
                    This answer is generated from the
                    legal provisions available in this
                    database. It is provided for legal
                    research and information only and
                    should not be treated as a substitute
                    for advice from a qualified lawyer.
                </p>

            </div>

        </div>

    `;


    answerBox.style.display = "block";

}