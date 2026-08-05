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