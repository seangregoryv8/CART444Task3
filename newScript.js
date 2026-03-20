function setToggleIcon(isLight) {
    const btn = document.querySelector(".lightDarkToggle");
    if (!btn) return;

    btn.style.setProperty("--x", isLight ? 2 : 3);
    btn.style.setProperty("--y", 3);
}

function applyTheme(isLight) {
    document.body.classList.toggle("light-mode", isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
    setToggleIcon(isLight);
}

function toggleTheme() {
    const isLight = !document.body.classList.contains("light-mode");
    applyTheme(isLight);
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    const isLight = savedTheme === "light";

    document.body.classList.toggle("light-mode", isLight);
    setToggleIcon(isLight);
});
