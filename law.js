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