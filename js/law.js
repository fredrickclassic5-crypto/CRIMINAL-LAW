document.getElementById("section").innerText =
localStorage.getItem("section");

document.getElementById("title").innerText =
localStorage.getItem("title");

document.getElementById("content").innerText =
localStorage.getItem("content");

function bookmarkLaw(){

let bookmarks =
JSON.parse(localStorage.getItem("bookmarks")) || [];

bookmarks.push({

section:
localStorage.getItem("section"),

title:
localStorage.getItem("title"),

content:
localStorage.getItem("content")

});

localStorage.setItem(

"bookmarks",

JSON.stringify(bookmarks)

);

alert("Law saved successfully.");

}