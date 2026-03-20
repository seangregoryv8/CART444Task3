function setToggleIcon(isLight) {
    const btn = document.querySelector(".lightDarkToggle");
    if (!btn) return;

    btn.style.setProperty("--x", isLight ? 2 : 3);
    btn.style.setProperty("--y", 3);

    document.querySelector(".effectsToggle").style.setProperty("--x", isLight ? 2 : 3);

    let icons = document.getElementsByClassName("iconInline");
    for (let i = 0; i < icons.length; i++)
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
    const btn = document.querySelector(".effectsToggle");
    if (!btn) return;

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

function addBlackLoadingBox() {
    const existing = document.getElementById("blackLoadingBox");
    if (existing) return existing;

    const blackBox = document.createElement("div");
    blackBox.id = "blackLoadingBox";
    blackBox.setAttribute("aria-hidden", "true");

    blackBox.style.position = "fixed";
    blackBox.style.left = "15%";
    blackBox.style.top = "0";
    blackBox.style.width = "100vw";
    blackBox.style.height = "100vh";
    blackBox.style.background = "#000000";
    blackBox.style.opacity = "1";
    blackBox.style.zIndex = "10000";
    blackBox.style.pointerEvents = "none";
    blackBox.style.transition = "opacity 220ms ease";

    document.body.appendChild(blackBox);
    return blackBox;
}

function removeBlackLoadingBox() {
    const blackBox = document.getElementById("blackLoadingBox");
    if (!blackBox) return;

    blackBox.style.opacity = "0";
    window.setTimeout(() => blackBox.remove(), 240);
}

addBlackLoadingBox();

setTimeout(() => 
{
    document.getElementById("blackLoadingBox").style.opacity = "0.6";
    setTimeout(() =>
    {
        document.getElementById("blackLoadingBox").style.opacity = "0.3";
        setTimeout(() => { removeBlackLoadingBox() }, 500)
    }, 500);
}, 500);