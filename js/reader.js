// ========================================
// GHANA CRIMINAL LAWS
// LAW READER
// ========================================


// ========================================
// READER ELEMENT
// ========================================

const reader =
    document.getElementById("lawReader");


// ========================================
// URL PARAMETERS
// ========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const file =
    urlParams.get("file");


const id =
    urlParams.get("id");


// ========================================
// ACT INFORMATION
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


    return file || "Ghana Law";

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
        "Untitled Legal Provision"
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
// LOAD LAW
// ========================================

async function loadLaw() {

    if (!reader) {

        return;

    }


    // ====================================
    // CHECK URL
    // ====================================

    if (!file || !id) {

        reader.innerHTML = `

            <div class="loading-card">

                <div class="loading-icon">
                    ⚠️
                </div>


                <h3>
                    Legal Provision Not Found
                </h3>


                <p>
                    The requested legal provision
                    could not be identified.
                </p>


                <a
                    href="global-search.html"
                    class="back-button"
                >
                    ← Back to Search
                </a>

            </div>

        `;

        return;

    }


    // ====================================
    // SHOW LOADING
    // ====================================

    reader.innerHTML = `

        <div class="loading-card">

            <div class="loading-icon">
                ⚖️
            </div>

            <h3>
                Loading ${escapeHTML(
                    getActShortName(file)
                )}
            </h3>

            <p>
                Retrieving the full legal provision...
            </p>

        </div>

    `;


    try {

        // ==================================
        // LOAD JSON
        // ==================================

        const response =
            await fetch(
                "data/" + file
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load law database."
            );

        }


        const laws =
            await response.json();


        if (!Array.isArray(laws)) {

            throw new Error(
                "Law database format is invalid."
            );

        }


        // ==================================
        // FIND LAW
        // ==================================

        const law =
            laws.find(
                item =>
                    String(item.id) ===
                    String(id)
            );


        if (!law) {

            reader.innerHTML = `

                <div class="loading-card">

                    <div class="loading-icon">
                        🔍
                    </div>


                    <h3>
                        Provision Not Found
                    </h3>


                    <p>
                        We could not find this
                        provision in the database.
                    </p>


                    <a
                        href="global-search.html"
                        class="back-button"
                    >
                        ← Back to Search
                    </a>

                </div>

            `;

            return;

        }


        // ==================================
        // LAW DATA
        // ==================================

        const section =
            getSection(law);


        const title =
            getTitle(law);


        const content =
            getContent(law);


        const actShortName =
            getActShortName(file);


        const actName =
            getActName(file);


        // ==================================
        // DISPLAY LAW
        // ==================================

        reader.innerHTML = `

            <article class="modern-law-card">

                <div class="law-card-top">

                    <div class="law-icon">
                        ⚖️
                    </div>

                </div>


                <div class="law-card-content">


                    <!-- ACT -->

                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:10px;
                            flex-wrap:wrap;
                            margin-bottom:18px;
                        "
                    >

                        <span
                            style="
                                background:#071f3d;
                                color:white;
                                padding:7px 12px;
                                border-radius:7px;
                                font-size:12px;
                                font-weight:800;
                                letter-spacing:.5px;
                            "
                        >
                            ${escapeHTML(
                                actShortName
                            )}
                        </span>


                        <span
                            style="
                                color:#718096;
                                font-size:13px;
                            "
                        >
                            ${escapeHTML(
                                actName
                            )}
                        </span>

                    </div>



                    <!-- SECTION -->

                    <p
                        style="
                            margin:0 0 8px;
                            color:#a87900;
                            font-size:14px;
                            font-weight:800;
                        "
                    >
                        ${escapeHTML(
                            section
                        )}
                    </p>



                    <!-- TITLE -->

                    <h1
                        class="law-title"
                        style="
                            font-size:28px;
                            margin-bottom:22px;
                        "
                    >
                        ${escapeHTML(
                            title
                        )}
                    </h1>



                    <!-- DIVIDER -->

                    <div
                        style="
                            height:1px;
                            background:#e2e8f0;
                            margin-bottom:25px;
                        "
                    ></div>



                    <!-- PROVISION -->

                    <p
                        style="
                            margin-bottom:10px;
                            font-size:12px;
                            font-weight:800;
                            color:#718096;
                            text-transform:uppercase;
                            letter-spacing:.6px;
                        "
                    >
                        📜 Full Legal Provision
                    </p>


                    <div
                        class="law-full-content"
                        style="
                            color:#2d3748;
                            font-size:16px;
                            line-height:1.8;
                            white-space:pre-wrap;
                        "
                    >
                        ${escapeHTML(
                            content
                        )}
                    </div>



                    <!-- FOOTER -->

                    <div
                        style="
                            margin-top:30px;
                            padding-top:20px;
                            border-top:1px solid #e2e8f0;
                        "
                    >

                        <p
                            style="
                                margin:0;
                                color:#a0aec0;
                                font-size:12px;
                            "
                        >
                            Source: ${escapeHTML(
                                actName
                            )}
                        </p>

                    </div>

                </div>

            </article>

        `;


        // ==================================
        // PAGE TITLE
        // ==================================

        document.title =
            section +
            " - " +
            title +
            " | Ghana Criminal Laws";


    } catch (error) {

        console.error(
            "Reader error:",
            error
        );


        reader.innerHTML = `

            <div class="loading-card">

                <div class="loading-icon">
                    ❌
                </div>


                <h3>
                    Unable to Load Provision
                </h3>


                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>


                <a
                    href="global-search.html"
                    class="back-button"
                >
                    ← Return to Legal Search
                </a>

            </div>

        `;

    }

}


// ========================================
// START
// ========================================

loadLaw();