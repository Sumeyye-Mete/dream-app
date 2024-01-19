// EVENTS============================

import { createNote, deleteNote, getNotes } from "./api.js";

// dark mode switch
document.getElementById("btnDarkMode").addEventListener("click", () => {
	document.querySelector("body").classList.toggle("dark-mode");
	const icon = btnDarkModeEl.querySelector("i");
	icon.classList.toggle("fa-moon");
	icon.classList.toggle("fa-sun");
});

// switch using fixed button
document.getElementById("btnShowAddNoteForm").addEventListener("click", () => {
	toggleAddNoteForm();
});

//  switch using add note form button
document.getElementById("btnHideForm").addEventListener("click", () => {
	toggleAddNoteForm();
});

//notu kaydet ve yolla
document.getElementById("btnAddNote").addEventListener("click", async () => {
	//form validation
	const titleEl = document.getElementById("title");
	const noteEl = document.getElementById("note");
	const colorsEl = document.querySelector("input[name='colors']:checked");
	showSpinner();

	try {
		const title = titleEl.value;
		const note = noteEl.value;
		const color = colorsEl.id;
		if (!title) throw new Error("Please enter a title");
		if (!note) throw new Error("Please enter a note");
		color ??= "light";

		const newNote = {
			title: title, // title, boyle de olur key value ayni olunca boyle yazilabiliyor.
			note: note,
			color: color,
		};

		//apiya yeni not kaydetme
		const data = await createNote(newNote);
		// Sayfaya, eklenen note ile alakalı card ekle
		const row = document.querySelector("#container .row");
		createNoteElement(data, row);
		// Reset
		reset(titleEl, noteEl);
	} catch (err) {
		alert(err.message);
	} finally {
		hideSpinner();
	}
});

// FUNCTIONS===============================

//add note form open/close switch
const toggleAddNoteForm = () => {
	document.querySelector(".add-note-form").classList.toggle("d-none");
	const icon = document.querySelector("#btnShowAddNoteForm i");
	icon.classList.toggle("fa-plus");
	icon.classList.toggle("fa-times");
};

//Loads notes from backend
const loadNotes = async () => {
	const row = document.querySelector("#container .row");
	row.innerHTML = "";
	showSpinner();
	try {
		const data = await getNotes();
		data.forEach((item) => {
			createNoteElement(item, row);
		});
	} catch (err) {
		alert(err.message);
	} finally {
		hideSpinner();
	}
};

const removeNoteElement = async (id) => {
	try {
		const result = confirm("Are you sure to delete?");
		if (!result) return;
		showSpinner();

		const deletedData = await deleteNote(id);
		const deletedNoteEl = document.querySelector(
			`div[data-id="${deletedData.id}"]`
		);
		deletedNoteEl.remove();
	} catch (err) {
		alert(err.message);
	} finally {
		hideSpinner();
	}
};

const createNoteHTML = (data) => {
	return `<div class="col d-flex justify-content-center" data-id ="${data.id}">
	<i class="fa-solid fa-cloud text-${data.color} cloud" >
		<div class="cloud-text-container">
			<div>
				<div class="fs-5">${data.title}</div>
			</div>
			<div class="note">	${data.note} </div>
		</div>
		<button class="btn btn-danger rounded-circle btn-close-cloud">
			<i class="fas fa-times"></i>
		</button>
	</i>
</div> `;
};

const createNoteElement = (data, row) => {
	const newNoteHtml = createNoteHTML(data);
	// DOMa yerlestir.
	row.insertAdjacentHTML("afterbegin", newNoteHtml);
	// carpiya basinca silme islemi tanimlama
	const btnDelete = row.querySelector(`div[data-id="${data.id}"] button`);
	btnDelete.addEventListener("click", async () => {
		await removeNoteElement(data.id);
	});
};

const reset = (titleEl, noteEl) => {
	titleEl.value = "";
	noteEl.value = "";
	document
		.querySelectorAll("input[name='colors']")[0]
		.setAttribute("checked", true);
	toggleAddNoteForm();
};

const showSpinner = () => {
	document.getElementById("spinner").style.display = "flex";
};
const hideSpinner = () => {
	document.getElementById("spinner").style.display = "none";
};
loadNotes();
