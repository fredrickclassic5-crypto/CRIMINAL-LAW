const params = new URLSearchParams(window.location.search);
const file = params.get("file");

const lawList = document.getElementById("lawList");

fetch("data/" + file)
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not load " + file);
        }

        return response.json();
    })
    .then(data => {

        lawList.innerHTML = "";

        data.forEach((law, index) => {

            // Get the section number safely
            const section =
                law.section ??
                law.sectionNumber ??
                law.number ??
                (index + 1);

            // Prevent "Section Section 1"
            const sectionText =
                String(section).toLowerCase().startsWith("section")
                    ? section
                    : "Section " + section;

            lawList.innerHTML += `
                <div class="dashboard-card"
                    onclick="location.href='reader.html?file=${encodeURIComponent(file)}&id=${encodeURIComponent(law.id)}'">

                    <h2>${sectionText}</h2>

                    <h3>${law.title || law.name || law.heading || ""}</h3>

                    <p>Click to read</p>

                </div>
            `;
        });

    })
    .catch(error => {

        console.error("Search error:", error);

        lawList.innerHTML = `
            <p style="color:red;">
                ${error.message}
            </p>
        `;
    });