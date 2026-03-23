// journal
// ELEMENTS
const freeBtn = document.getElementById("freeBtn");
const promptedBtn = document.getElementById("promptedBtn");
const viewBtn = document.getElementById("viewBtn");
const lockBtn = document.getElementById("lockBtn");
const editor = document.getElementById("editor");
const toolbar = document.getElementById("toolbar");
const saveBtn = document.getElementById("saveBtn");
const lockEntryBtn = document.getElementById("lockEntryBtn");
const backBtn = document.getElementById("backBtn");
const categoriesDiv = document.getElementById("promptCategories");
const entriesSection = document.getElementById("entriesSection");
const dateDisplay = document.getElementById("dateDisplay");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearch = document.getElementById("clearSearch");

if (dateDisplay) {
    dateDisplay.innerText = new Date().toDateString();
}

let currentType = "";
let lockCurrentEntry = false;

// ---------- UTIL ----------
function showHome() {
    editor.style.display = toolbar.style.display =
        saveBtn.style.display = lockEntryBtn.style.display =
        backBtn.style.display = categoriesDiv.style.display =
        entriesSection.style.display = "none";
}

backBtn.onclick = showHome;

// ---------- FORMAT ----------
function format(cmd) {
    document.execCommand(cmd, false, null);
}
function setColor(color) {
    document.execCommand("foreColor", false, color);
}
function alignText(type) {
    document.execCommand(type, false, null);
}
window.alignText = alignText;
// ---------- LOCK SYSTEM ----------
function unlockJournal() {
    const pwd = prompt("Enter journal password:");
    return pwd === localStorage.getItem("password");
}

lockBtn.onclick = () => {
    if (unlockJournal()) {
        viewEntries(true);
    } else {
        alert("Wrong password ❌");
    }
};

// ---------- FREE ----------
freeBtn.onclick = () => {
    currentType = "Free Writing";
    lockCurrentEntry = false;
    editor.innerHTML = "";
    editor.style.textAlign = "left";
    editor.style.display = toolbar.style.display =
        saveBtn.style.display = lockEntryBtn.style.display =
        backBtn.style.display = "block";
    editor.focus();
};

// ---------- PROMPTED ----------
const prompts = {
    "🌅 Morning Intention": [
        "Top 3 things I want to accomplish today?",
        "What would make today a win?",
        "How do I want to feel today?",
        "One small habit I commit to today?",
        "What might distract me—and how will I handle it?"
    ],
    "🎯 Focus & Productivity": [
        "What task am I working on?",
        "Why is it important?",
        "Next tiny step?",
        "Focus level (1–10)?",
        "One thing to remove to focus better?"
    ],
    "🧠 Self-Reflection": [
        "What’s been on my mind lately?",
        "Strongest emotion right now—and why?",
        "What am I avoiding?",
        "What do I need more of?",
        "What would I tell my best friend?"
    ],
    "🚧 Self-Sabotage": [
        "What pattern holds me back?",
        "What fear is influencing me?",
        "Worst case—and how would I handle it?",
        "What excuse am I making?",
        "One brave action today?"
    ],
    "🌙 Night Reflection": [
        "What did I do well today?",
        "What drained me?",
        "What energized me?",
        "Lesson from today?",
        "One thing I’m grateful for?"
    ],
    "💖 Self-Love": [
        "What am I proud of?",
        "What makes me unique?",
        "How have I grown?",
        "Who am I becoming?",
        "What does future me thank me for?"
    ],
    "🧩 Weekly Reset": [
        "What worked well?",
        "What didn’t?",
        "Best habit?",
        "What to improve next?",
        "Main focus going forward?"
    ]
};

promptedBtn.onclick = () => {
    currentType = "Prompted Journal";
    categoriesDiv.innerHTML = "";
    categoriesDiv.style.display =
        editor.style.display =
        toolbar.style.display =
        saveBtn.style.display =
        lockEntryBtn.style.display =
        backBtn.style.display = "block";

    for (let cat in prompts) {
        const b = document.createElement("button");
        b.innerText = cat;
        b.onclick = () => {
            editor.innerHTML = `<h3>${cat}</h3>`;
            prompts[cat].forEach(q =>
                editor.innerHTML += `<p><b>${q}</b><br><br></p>`
            );
        };
        categoriesDiv.appendChild(b);
    }
};

// ---------- SAVE ----------
lockEntryBtn.onclick = () => {
    lockCurrentEntry = true;
    alert("This entry will be locked 🔒");
};

saveBtn.onclick = () => {
    const entries = JSON.parse(localStorage.getItem("entries") || "[]");

    entries.push({
        date: new Date().toLocaleString(),
        type: currentType,
        content: editor.innerHTML,
        locked: lockCurrentEntry
    });

    localStorage.setItem("entries", JSON.stringify(entries));
    showHome();
};

// ---------- VIEW ENTRIES ----------
viewBtn.onclick = () => viewEntries(false);

function viewEntries(showLocked, keyword = "") {
    entriesSection.innerHTML = "<h3>Saved Entries</h3>";
    entriesSection.style.display = backBtn.style.display = "block";

    const entries = JSON.parse(localStorage.getItem("entries") || "[]");

    entries.forEach((e, i) => {
        if (e.locked && !showLocked) return;
        // 🔍 SEARCH FILTER (added)
        if (keyword) {
            const text = e.content.toLowerCase();
            if (!text.includes(keyword.toLowerCase())) return;
        }
        const div = document.createElement("div");
        div.style.border = "1px solid gray";
        div.style.margin = "10px";
        div.style.padding = "10px";

        // Remove HTML tags and limit text length
        const previewText = e.content.replace(/<[^>]+>/g, "").slice(0, 100);

        div.innerHTML = `
    <b>${e.type}</b> | ${e.date}
    ${e.locked ? "🔒" : ""}
    <p style="color:gray; margin-top:5px;">
        ${previewText}...
    </p>
    <button onclick="openEntry(${i})">View</button>
    <button onclick="deleteEntry(${i})">Delete</button>
`;
        entriesSection.appendChild(div);
    });
}
searchBtn.onclick = () => {
    const keyword = searchInput.value.trim();
    viewEntries(false, keyword);
};

clearSearch.onclick = () => {
    searchInput.value = "";
    viewEntries(false);
};
window.openEntry = (i) => {
    const entries = JSON.parse(localStorage.getItem("entries"));
    const e = entries[i];

    if (e.locked && !unlockJournal()) {
        alert("Locked entry ❌");
        return;
    }

    editor.innerHTML = e.content;
    editor.style.display = toolbar.style.display = backBtn.style.display = "block";
};

window.deleteEntry = (i) => {
    const entries = JSON.parse(localStorage.getItem("entries"));
    entries.splice(i, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    viewEntries(false);
};
window.format = format;
window.setColor = setColor;