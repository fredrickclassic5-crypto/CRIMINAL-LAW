// ========================================
// MODERN GHANA CRIMINAL LAWS DASHBOARD
// ========================================

const dashboard =
    document.getElementById("dashboard");


// ========================================
// LAW DATABASE
// ========================================

const lawDatabases = [

    {
        title: "Criminal Offences Act",
        subtitle: "1960 (Act 29)",
        file: "act29.json",
        icon: "⚖️"
    },

    {
        title: "Criminal and Other Offences",
        subtitle: "Procedure Act, 1960 (Act 30)",
        file: "act30.json",
        icon: "🏛️"
    },

    {
        title: "Evidence Act",
        subtitle: "1975 (NRCD 323)",
        file: "evidence.json",
        icon: "📖"
    }

];


// ========================================
// DISPLAY DASHBOARD
// ========================================

function displayActs() {

    if (!dashboard) {

        console.error(
            "Dashboard container #dashboard was not found."
        );

        return;
    }


    dashboard.innerHTML = "";


    lawDatabases.forEach((law) => {


        const card =
            document.createElement("div");


        card.className =
            "modern-law-card";


        card.innerHTML = `

            <div class="law-card-top">

                <div class="law-icon">
                    ${law.icon}
                </div>

                <span class="law-arrow">
                    →
                </span>

            </div>


            <div class="law-card-content">

                <p class="law-type">
                    GHANA LAW
                </p>

                <h3>
                    ${law.title}
                </h3>

                <p class="law-subtitle">
                    ${law.subtitle}
                </p>

                <p class="law-action">
                    Open Act →
                </p>

            </div>

        `;


        // =================================
        // OPEN LAW
        // =================================

        card.addEventListener(
            "click",
            function () {

                window.location.href =
                    "search.html?file=" +
                    encodeURIComponent(
                        law.file
                    );

            }
        );


        dashboard.appendChild(card);

    });

}


// ========================================
// SEARCH BOX
// ========================================

const searchInput =
    document.getElementById(
        "searchInput"
    );


const globalSearchBtn =
    document.getElementById(
        "globalSearchBtn"
    );


function performDashboardSearch() {

    if (!searchInput) {
        return;
    }


    const query =
        searchInput.value.trim();


    if (!query) {

        searchInput.focus();

        return;
    }


    window.location.href =
        "global-search.html?q=" +
        encodeURIComponent(query);

}


// ========================================
// SEARCH BUTTON
// ========================================

if (globalSearchBtn) {

    globalSearchBtn.addEventListener(
        "click",
        performDashboardSearch
    );

}


// ========================================
// ENTER KEY SEARCH
// ========================================

if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                performDashboardSearch();

            }

        }
    );

}


// ========================================
// START DASHBOARD
// ========================================

displayActs();