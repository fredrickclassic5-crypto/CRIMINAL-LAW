// Get the ID from the URL
const params = new URLSearchParams(window.location.search);
const lawId = Number(params.get("id"));

fetch("data/laws.json")
.then(response => response.json())
.then(laws => {

    const law = laws.find(item => item.id === lawId);

    if(law){

        document.getElementById("title").textContent = law.title;

        document.getElementById("section").textContent = law.section;

        document.getElementById("act").textContent = law.act;

        document.getElementById("content").textContent = law.content;

    }else{

        document.getElementById("title").textContent = "Law Not Found";

    }

});

const params = new URLSearchParams(window.location.search);
const lawId = Number(params.get("id"));

let currentLaw = null;

fetch("data/laws.json")
.then(response => response.json())
.then(laws => {

    currentLaw = laws.find(law => law.id === lawId);

    if(!currentLaw) return;

    document.getElementById("title").textContent = currentLaw.title;
    document.getElementById("section").textContent = currentLaw.section;
    document.getElementById("act").textContent = currentLaw.act;
    document.getElementById("content").textContent = currentLaw.content;

});

document.getElementById("bookmarkBtn").addEventListener("click", () => {

    if(!currentLaw) return;

    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    const exists = bookmarks.find(item => item.id === currentLaw.id);

    if(exists){

        alert("This law is already bookmarked.");
        return;

    }

    bookmarks.push(currentLaw);

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    alert("Law bookmarked successfully.");

});