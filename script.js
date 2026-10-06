let notes = JSON.parse(localStorage.getItem("studentNotes")) || [];

function saveToStorage() {
  localStorage.setItem("studentNotes", JSON.stringify(notes));
}

function saveNote() {
  const title = document.getElementById("title").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const content = document.getElementById("content").value.trim();
  const editId = document.getElementById("editId").value;

  if (!title || !subject || !content) {
    alert("Please fill in all fields.");
    return;
  }

  if (editId) {
    const note = notes.find(n => n.id === Number(editId));
    note.title = title;
    note.subject = subject;
    note.content = content;
  } else {
    notes.unshift({
      id: Date.now(),
      title,
      subject,
      content,
      important: false,
      createdAt: new Date().toLocaleDateString()
    });
  }

  saveToStorage();
  resetForm();
  renderNotes();
}

function editNote(id) {
  const note = notes.find(n => n.id === id);

  document.getElementById("title").value = note.title;
  document.getElementById("subject").value = note.subject;
  document.getElementById("content").value = note.content;
  document.getElementById("editId").value = note.id;

  document.getElementById("formTitle").textContent = "Edit Note";
  document.getElementById("saveBtn").textContent = "Update Note";
  document.getElementById("cancelBtn").hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteNote(id) {
  if (!confirm("Delete this note?")) return;

  notes = notes.filter(note => note.id !== id);
  saveToStorage();
  renderNotes();
}

function toggleImportant(id) {
  const note = notes.find(n => n.id === id);
  note.important = !note.important;
  saveToStorage();
  renderNotes();
}

function resetForm() {
  document.getElementById("title").value = "";
  document.getElementById("subject").value = "";
  document.getElementById("content").value = "";
  document.getElementById("editId").value = "";

  document.getElementById("formTitle").textContent = "Add New Note";
  document.getElementById("saveBtn").textContent = "Add Note";
  document.getElementById("cancelBtn").hidden = true;
}

function renderNotes() {
  const list = document.getElementById("notesList");
  const empty = document.getElementById("emptyMessage");
  const search = document.getElementById("search").value.toLowerCase();
  const filter = document.getElementById("filter").value;

  const filtered = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(search) ||
      note.subject.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search);

    const matchesFilter =
      filter === "all" || note.important;

    return matchesSearch && matchesFilter;
  });

  list.innerHTML = "";

  filtered.forEach(note => {
    const card = document.createElement("article");
    card.className = `note-card ${note.important ? "important" : ""}`;

    card.innerHTML = `
      <h3>${escapeHTML(note.title)}</h3>
      <div class="subject">Subject: ${escapeHTML(note.subject)} | ${note.createdAt}</div>
      <div class="note-content">${escapeHTML(note.content)}</div>
      <div class="note-actions">
        <button onclick="editNote(${note.id})">Edit</button>
        <button class="important-btn" onclick="toggleImportant(${note.id})">
          ${note.important ? "Unmark Important" : "Mark Important"}
        </button>
        <button class="delete-btn" onclick="deleteNote(${note.id})">Delete</button>
      </div>
    `;

    list.appendChild(card);
  });

  empty.style.display = filtered.length ? "none" : "block";
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

renderNotes();
