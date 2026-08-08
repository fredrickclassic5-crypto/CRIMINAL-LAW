const params = new URLSearchParams(window.location.search);
const file = params.get("file");

const lawList = document.getElementById("lawList");

fetch("data/" + file)
.then(response => response.json())
.then(data => {

    lawList.innerHTML = "";

    data.forEach((law, index) => {

        lawList.innerHTML += `

        <div class="dashboard-card"
             onclick="location.href='reader.html?file=${file}&id=${law.id}'"

            <h2>${law.section}</h2>

            <h3>${law.title}</h3>

            <p>Click to read</p>

        </div>

        `;

    });

});