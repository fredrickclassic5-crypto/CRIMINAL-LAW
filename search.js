const params = new URLSearchParams(window.location.search);

const file = params.get("file");

fetch("data/" + file)
.then(res => res.json())
.then(laws => {

    show(laws);

    document.getElementById("searchInput")
    .addEventListener("keyup", function(){

        const word = this.value.toLowerCase();

        const result = laws.filter(law =>

            law.title.toLowerCase().includes(word) ||

            law.section.toLowerCase().includes(word)

        );

        show(result);

    });

});

function show(laws){

    const container = document.getElementById("lawContainer");

    container.innerHTML="";

    laws.forEach(law=>{

        container.innerHTML += `

        <div class="card">

            <h3>${law.section}</h3>

            <p>${law.title}</p>

        </div>

        `;

    });

}