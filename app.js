document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        alert(card.innerText);
    });
});