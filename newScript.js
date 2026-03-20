function setToggleIcon(isLight) {
    const btn = document.querySelector(".lightDarkToggle");
    if (!btn) return;

    btn.style.setProperty("--x", isLight ? 2 : 3);
    btn.style.setProperty("--y", 3);

    document.querySelector(".effectsToggle").style.setProperty("--x", isLight ? 2 : 3);
    console.log(document.getElementsByClassName("iconInline"))
    let icons = document.getElementsByClassName("iconInline");
    for (let i = 0; i <= icons.length; i++)
        icons[i].style.setProperty("--x", isLight ? 2 : 3)
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

function setEffectsIcon(isEffectsOn) {
    btn.style.setProperty("--y", 4);
    btn.setAttribute("aria-pressed", String(!isEffectsOn));
}

function applyEffects(isEffectsOn) {
    document.body.classList.toggle("effects-off", !isEffectsOn);
    localStorage.setItem("effects", isEffectsOn ? "on" : "off");
    setEffectsIcon(isEffectsOn);
}

function toggleEffects() {
    const isEffectsOn = !document.body.classList.contains("effects-off");
    applyEffects(!isEffectsOn);
}

document.addEventListener("DOMContentLoaded", () => {
    const savedEffects = localStorage.getItem("effects");
    const isEffectsOn = savedEffects !== "off";
    applyEffects(isEffectsOn);
});