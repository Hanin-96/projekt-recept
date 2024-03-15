const scrollBtn = document.getElementById("scroll-btn");

window.addEventListener("scroll", checkHeight);

function checkHeight() {
    if (window.scrollY > 600) {
        scrollBtn.style.display = "flex";
    } else {
        scrollBtn.style.display = "none"
    }
}

scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
})