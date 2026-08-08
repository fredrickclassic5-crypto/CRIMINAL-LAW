const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

let laws = [];

fetch("data/ghana_laws.json")
.then(response => response.json())
.then(data => {

    laws = data;

});

searchInput.addEventListener("input", function(){

    const keyword = this.value.toLowerCase();

    results.innerHTML = "";

    if(keyword === "") return;

    const filtered = laws.filter(law =>

        law.title.toLowerCase().includes(keyword) ||

        law.section.toLowerCase().includes(keyword) ||

        law.content.toLowerCase().includes(keyword)

    );

    filtered.forEach(law=>{

        results.innerHTML += `

        <div class="dashboard-card"
        onclick="location.href='reader.html?file=${law.file}&id=${law.id}'">

            <h2>${law.section}</h2>

            <h3>${law.title}</h3>

            <p>${law.file}</p>

        </div>

        `;

    });

});