const dashboard = document.querySelector(".dashboard");

fetch("data/acts.json")
.then(response => response.json())
.then(acts => {

    dashboard.innerHTML = "";

    acts.forEach(act => {

        dashboard.innerHTML += `
        <div class="dashboard-card"
             onclick="location.href='search.html?file=${act.file}'">

            <div class="icon">⚖️</div>

            <h2>${act.name}</h2>

            <p>Open Act</p>

        </div>
        `;

    });

})
.catch(error => {
    console.error(error);
    dashboard.innerHTML = "<h2>Failed to load Acts.</h2>";
});