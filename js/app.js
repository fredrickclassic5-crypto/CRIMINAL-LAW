const container = document.getElementById("lawContainer");

async function loadActs(){

    const db = await loadDatabase();

    container.innerHTML = "";

    db.acts.forEach(act=>{

        container.innerHTML += `

        <div class="card"
             onclick="openAct(${act.id})">

            <h2>${act.title}</h2>

        </div>

        `;

    });

}

function openAct(id){

    window.location.href=`search.html?act=${id}`;

}

loadActs();