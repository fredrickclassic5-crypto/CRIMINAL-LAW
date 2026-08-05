const container = document.getElementById("bookmarkContainer");

let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

if(bookmarks.length === 0){

    container.innerHTML = "<h3>No bookmarks yet.</h3>";

}else{

    bookmarks.forEach(law=>{

        container.innerHTML += `

        <div class="card">

            <h3>${law.title}</h3>

            <p>${law.section}</p>

            <small>${law.act}</small>

            <br><br>

            <button onclick="openLaw(${law.id})">

            Open

            </button>

        </div>

        `;

    });

}

function openLaw(id){

    window.location.href=`law.html?id=${id}`;

}