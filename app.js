document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        alert(card.innerText);
    });
});

fetch("data/laws.json")
.then(response => response.json())
.then(data => {

    const container = document.getElementById("lawContainer");

    data.forEach(law => {

        container.innerHTML += `

        <div class="card">

            <h3>${law.title}</h3>

            <p>${law.section}</p>

            <small>${law.act}</small>

        </div>

        `;

    });

});
// Get the container where the law cards will appear
const lawContainer = document.getElementById("lawContainer");

// Load the laws
fetch("data/laws.json")
    .then(response => response.json())
    .then(laws => {

        displayLaws(laws);

        // Search feature
        const searchInput = document.getElementById("searchInput");

        searchInput.addEventListener("keyup", () => {

            const keyword = searchInput.value.toLowerCase();

            const filtered = laws.filter(law =>

                law.title.toLowerCase().includes(keyword) ||
                law.section.toLowerCase().includes(keyword) ||
                law.act.toLowerCase().includes(keyword)

            );

            displayLaws(filtered);

        });

    });

// Display all laws
function displayLaws(laws){

    lawContainer.innerHTML = "";

    laws.forEach(law=>{

        lawContainer.innerHTML += `

        <div class="card">

            <h3>${law.title}</h3>

            <p>${law.section}</p>

            <small>${law.act}</small>

            <br><br>

            <button onclick="readLaw(${law.id})">

                Read Law

            </button>

        </div>

        `;

    });

}

// Open the law
function readLaw(id){

    alert("Opening Law ID : " + id);

}

function readLaw(id){

    window.location.href = `law.html?id=${id}`;

}

const container = document.getElementById("lawContainer");

fetch("data/acts.json")
.then(res => res.json())
.then(acts => {

    acts.forEach(act => {

        container.innerHTML += `

        <div class="card" onclick="openAct('${act.file}')">

            <h2>${act.name}</h2>

        </div>

        `;

    });

});

function openAct(file){

    window.location.href = `search.html?file=${file}`;

}