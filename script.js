const titleInput = document.getElementById("titleInput");
const textInput = document.getElementById("textInput");
const colorSelect = document.getElementById("colorSelect");

const addBtn = document.getElementById("addBtn");
const notesContainer = document.getElementById("notesContainer");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const clearAll = document.getElementById("clearAll");

const emptyState = document.getElementById("emptyState");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

renderNotes();

addBtn.addEventListener("click", addNote);
searchInput.addEventListener("input", renderNotes);
sortSelect.addEventListener("change", renderNotes);
clearAll.addEventListener("click", clearNotes);

function addNote(){

    const title = titleInput.value.trim();
    const text = textInput.value.trim();

    if(!title && !text) return;

    const note = {
        id:Date.now(),
        title,
        text,
        color:colorSelect.value,
        pinned:false,
        created:new Date().toLocaleString(),
        updated:new Date().toLocaleString()
    };

    notes.push(note);

    save();
    clearInputs();
    renderNotes();
}

function deleteNote(id){

    notes = notes.filter(n => n.id !== id);

    save();
    renderNotes();
}

function editNote(id){

    const note = notes.find(n => n.id === id);

    const newTitle = prompt("Edit title:", note.title);
    const newText = prompt("Edit note:", note.text);

    if(newTitle !== null) note.title = newTitle;
    if(newText !== null) note.text = newText;

    note.updated = new Date().toLocaleString();

    save();
    renderNotes();
}

function togglePin(id){

    const note = notes.find(n => n.id === id);
    note.pinned = !note.pinned;

    save();
    renderNotes();
}

async function copyNote(text){

    await navigator.clipboard.writeText(text);

    alert("Copied!");
}

function clearNotes(){

    if(!confirm("Delete all notes?")) return;

    notes = [];

    save();
    renderNotes();
}

function renderNotes(){

    let filtered = [...notes];

    // search
    const search = searchInput.value.toLowerCase();

    filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(search) ||
        n.text.toLowerCase().includes(search)
    );

    // sort
    const sort = sortSelect.value;

    if(sort === "newest"){
        filtered.sort((a,b)=>b.id-a.id);
    }else if(sort === "oldest"){
        filtered.sort((a,b)=>a.id-b.id);
    }else if(sort === "az"){
        filtered.sort((a,b)=>a.title.localeCompare(b.title));
    }

    // pinned first
    filtered.sort((a,b)=>b.pinned - a.pinned);

    notesContainer.innerHTML = "";

    if(filtered.length === 0){
        emptyState.style.display = "block";
    }else{
        emptyState.style.display = "none";
    }

    filtered.forEach(note => {

        const div = document.createElement("div");
        div.className = `note ${note.color} ${note.pinned ? "pinned" : ""}`;

        div.innerHTML = `
            <span class="pin" onclick="togglePin(${note.id})">📌</span>

            <h3>${note.title || "Untitled"}</h3>
            <p>${note.text}</p>

            <small>Created: ${note.created}</small><br>
            <small>Updated: ${note.updated}</small>

            <div class="actions">
                <button onclick="editNote(${note.id})">Edit</button>
                <button onclick="deleteNote(${note.id})">Delete</button>
                <button onclick="copyNote(\`${note.text}\`)">Copy</button>
            </div>
        `;

        notesContainer.appendChild(div);
    });
}

function save(){
    localStorage.setItem("notes", JSON.stringify(notes));
}

function clearInputs(){
    titleInput.value = "";
    textInput.value = "";
}