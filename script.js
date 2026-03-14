const els = {
    menu: document.getElementById("menu"),
    menuToggle: document.getElementById("menuToggle"),
    menuClose: document.getElementById("menuClose"),
    backdrop: document.getElementById("backdrop"),
    philosophyList: document.getElementById("philosophyList"),
    siteTitle: document.getElementById("siteTitle"),
    siteTagline: document.getElementById("siteTagline"),
    introParagraphs: document.getElementById("introParagraphs"),
    content: document.getElementById("content"),
};

function setMenuOpen(isOpen)
{
    if (!els.menu || !els.menuToggle || !els.backdrop) return;

    els.menu.hidden = !isOpen;
    els.backdrop.hidden = !isOpen;
    els.menuToggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen)
    {
      document.body.style.overflow = "hidden";
      els.menuClose?.focus();
    }
    else
    {
      document.body.style.overflow = "";
      els.menuToggle.focus();
    }
}

function wireMenuChrome() {
    els.menuToggle?.addEventListener("click", () => {
      const isOpen = Boolean(els.menu && !els.menu.hidden);
      setMenuOpen(!isOpen);
    });
    els.menuClose?.addEventListener("click", () => setMenuOpen(false));
    els.backdrop?.addEventListener("click", () => setMenuOpen(false));

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && els.menu && !els.menu.hidden) setMenuOpen(false);
    });
}

function createEl(tag, className, text)
{
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
}

function renderIntro(introJson)
{
    if (introJson?.siteTitle && els.siteTitle)
    {
        els.siteTitle.textContent = introJson.siteTitle;
        document.title = introJson.siteTitle;
    }

    if (introJson?.tagline && els.siteTagline) els.siteTagline.textContent = introJson.tagline;

    if (els.introParagraphs && Array.isArray(introJson?.paragraphs))
    {
        els.introParagraphs.innerHTML = "";
        for (const paragraph of introJson.paragraphs)
        {
            const p = document.createElement("p");
            p.textContent = paragraph;
            els.introParagraphs.appendChild(p);
        }
    }
}

function setExpanded(button, panel, expanded)
{
    button.setAttribute("aria-expanded", String(expanded));
    panel.hidden = !expanded;
}

function collapseAllExcept(buttonToKeepOpen)
{
    const buttons = els.philosophyList?.querySelectorAll("button.menuItemButton") ?? [];
    for (const button of buttons)
    {
        if (button === buttonToKeepOpen) continue;
        const panelId = button.getAttribute("aria-controls");
        if (!panelId) continue;
        const panel = document.getElementById(panelId);
        if (!panel) continue;
        setExpanded(button, panel, false);
    }
}

function renderMenuItems(philosophyJson)
{
    if (!els.philosophyList) return;
    els.philosophyList.innerHTML = "";

    const items = Array.isArray(philosophyJson) ? philosophyJson : Array.isArray(philosophyJson?.items) ? philosophyJson.items : [];
    let autoId = 0;
    for (const item of items)
    {
        const li = createEl("li", "menuItem");
        const button = createEl("button", "menuItemButton");
        button.type = "button";
        button.setAttribute("aria-expanded", "false");
        
        const title = createEl("span", "", item?.label ?? item?.title ?? item?.name ?? "Untitled");
        const chev = createEl("span", "chev", "›");
        chev.setAttribute("aria-hidden", "true");
        button.appendChild(title);
        button.appendChild(chev);
        
        const panel = createEl("div", "menuItemPanel");
        autoId += 1;
        const safeId = String(item?.id ?? item?.name ?? `item-${autoId}`).replace(/[^a-zA-Z0-9_-]/g, "-");
        const panelId = `panel-${safeId}`;
        panel.id = panelId;
        panel.hidden = true;
        button.setAttribute("aria-controls", panelId);

        if (item?.overview)
        {
            const p = document.createElement("p");
            p.textContent = item.overview;
            panel.appendChild(p);
        }
        
        const sections = Array.isArray(item?.sections) ? item.sections : [];
        for (const section of sections)
        {
            if (section?.heading) panel.appendChild(createEl("h3", "", section.heading));
            const paragraphs = Array.isArray(section?.paragraphs) ? section.paragraphs : [];
            for (const paragraph of paragraphs)
            {
                const p = document.createElement("p");
                p.textContent = paragraph;
                panel.appendChild(p);
            }
        }
      
        button.addEventListener("click", () => {
            const next = button.getAttribute("aria-expanded") !== "true";
            collapseAllExcept(button);
            setExpanded(button, panel, next);
        });
      
        li.appendChild(button);
        li.appendChild(panel);
        els.philosophyList.appendChild(li);
    }
}   

function showLoadError(message)
{
    const container = document.createElement("p");
    container.textContent = message;
    container.style.color = "rgba(255,255,255,0.75)";
    container.style.margin = "12px 0 0";
    els.introParagraphs?.appendChild(container);
}

async function loadJson(path)
{
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to load ${path} (${response.status})`);
    return response.json();
}

async function init()
{
    wireMenuChrome();

    try
    {
        const [introJson, menuIndexJson] = await Promise.all([
            loadJson("./data/intro.json"),
            loadJson("./philosophy.json"),
        ]);
        renderIntro(introJson);

        const menuIndex = Array.isArray(menuIndexJson) ? menuIndexJson : [];
        const detailsByName = new Map();
        await Promise.all(
            menuIndex.map(async item => {
                if (!item?.name || !item?.file) return;
                const detail = await loadJson(String(item.file));
                detailsByName.set(String(item.name), detail);
            }),
        );

        const mergedMenuItems = menuIndex.map(item => {
            const detail = item?.name ? detailsByName.get(String(item.name)) : null;
            if (!detail) return item;
            return {
                ...item,
                id: detail.id ?? item.id ?? item.name,
                title: detail.title ?? item.title ?? item.label,
                sections: detail.sections ?? item.sections,
            };
        });

        renderMenuItems(mergedMenuItems);
    }
    catch (error)
    {
        renderMenuItems([]);
        showLoadError("Could not load JSON. If you're opening this as a file (file://), run a local server (e.g., VS Code Live Server).");
        // eslint-disable-next-line no-console
        console.error(error);
    }
}

init();
