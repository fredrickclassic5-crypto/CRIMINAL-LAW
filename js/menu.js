// ========================================
// MODERN SIDE MENU
// ========================================

const menuBtn =
    document.getElementById("menuBtn");

const sideMenu =
    document.getElementById("sideMenu");


if (menuBtn && sideMenu) {

    menuBtn.addEventListener(
        "click",
        function () {

            sideMenu.classList.toggle("open");

        }
    );

}


// ========================================
// CLOSE MENU WHEN LINK IS CLICKED
// ========================================

if (sideMenu) {

    const menuLinks =
        sideMenu.querySelectorAll("a");

    menuLinks.forEach(link => {

        link.addEventListener(
            "click",
            function () {

                sideMenu.classList.remove(
                    "open"
                );

            }
        );

    });

}


// ========================================
// CLOSE MENU WHEN CLICKING OUTSIDE
// ========================================

document.addEventListener(
    "click",
    function (event) {

        if (!sideMenu || !menuBtn) {
            return;
        }


        const clickedInsideMenu =
            sideMenu.contains(event.target);


        const clickedMenuButton =
            menuBtn.contains(event.target);


        if (
            !clickedInsideMenu &&
            !clickedMenuButton
        ) {

            sideMenu.classList.remove(
                "open"
            );

        }

    }
);