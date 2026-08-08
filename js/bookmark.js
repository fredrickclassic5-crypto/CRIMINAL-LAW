const container = document.getElementById("bookmarkContainer");

const bookmarks =
JSON.parse(localStorage.getItem("bookmarks")) || [];

if(bookmarks.length === 0){

    container.innerHTML = "<h2>No bookmarks yet.</h2>";

}else{

    bookmarks.forEach(law=>{

        container.innerHTML += `

        <div class="dashboard-card"
        onclick="location.href='reader.html?file=${law.file}&id=${law.id}'">

            <h2>${law.section}</h2>

            <h3>${law.title}</h3>

            <p>Open bookmarked law</p>

        </div>

        `;

    });

}