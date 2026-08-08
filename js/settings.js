function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark-mode")
    );

}

function increaseFont() {

    document.body.style.fontSize = "20px";

}

function decreaseFont() {

    document.body.style.fontSize = "16px";

}

window.onload = () => {

    if(localStorage.getItem("darkMode") === "true"){

        document.body.classList.add("dark-mode");

    }

};