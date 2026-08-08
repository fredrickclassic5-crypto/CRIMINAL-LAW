const askBtn = document.getElementById("askBtn");

askBtn.onclick = async function () {

    const questionInput = document.getElementById("question");
    const answer = document.getElementById("answer");

    const question = questionInput.value
    .toLowerCase()
    .replace(/[?.,!]/g, "")
    .trim();

    if (!question) {
        answer.innerHTML = "<p>Please enter a legal question.</p>";
        return;
    }

    answer.innerHTML = "<p>🔎 Searching Ghana Laws...</p>";

    const files = [
        "act29.json",
        "act30.json",
        "evidence.json"
    ];

    const stopWords = [
        "what", "is", "the", "a", "an",
        "of", "in", "on", "for", "to",
        "and", "or", "are", "under",
        "explain", "tell", "me", "about",
        "please", "can", "you", "does",
        "mean", "how", "who"
    ];

    const words = question
    .replace(/[?.!,]/g, "")
    .split(/\s+/)
    .filter(word => !stopWords.includes(word))
    .filter(word => word.length > 2);

    let found = [];

    try {

        for (const file of files) {

            const response = await fetch("data/" + file);

            if (!response.ok) {
                console.error("Could not load:", file);
                continue;
            }

            const laws = await response.json();

            laws.forEach(law => {

                const text = (
                    (law.title || "") +
                    " " +
                    (law.content || "") +
                    " " +
                    (law.section || "")
                ).toLowerCase();

                const matches = words.filter(word =>
                    text.includes(word)
                );

                if (matches.length > 0) {

                    found.push({
                        ...law,
                        source: file,
                        score: matches.length
                    });

                }

            });
        }

        // Highest matching results first
        found.sort((a, b) => b.score - a.score);

        if (found.length === 0) {

            answer.innerHTML = `
                <div class="dashboard-card">
                    <h3>🔍 No Result Found</h3>
                    <p>
                        I could not find a matching section in the
                        available law database.
                    </p>
                </div>
            `;

            return;
        }

        // Show the best 10 results
        const results = found.slice(0, 10);

        let html = `
            <h2>🔎 Search Results</h2>
            <p>${found.length} matching section(s) found.</p>
        `;

        results.forEach(law => {

            html += `
                <div class="dashboard-card">

                    <p>
                        <strong>
                            ${getActName(law.source)}
                        </strong>
                    </p>

                    <h3>
                        Section ${law.section || ""}
                    </h3>

                    <h2>
                        ${law.title || "Untitled Section"}
                    </h2>

                    <p>
                        ${law.content || ""}
                    </p>

                </div>

                <br>
            `;

        });

        answer.innerHTML = html;

    } catch (error) {

        console.error("AI Search Error:", error);

        answer.innerHTML = `
            <div class="dashboard-card">
                <h3>⚠️ Search Error</h3>
                <p>
                    There was a problem searching the law database.
                </p>
            </div>
        `;
    }
};


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