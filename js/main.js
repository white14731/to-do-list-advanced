import { btnSort, allMenuNote, complitedNoteSort, unComplitedNoteSort, allNoteList} from "./constant.js"; // меню сортировки
import {closeModalWindows, modalWindows, newNoteBtn} from "./constant.js"; // модальное окно
import {inpNewNote, addNewNote, listNote, arrList, searchItem} from "./constant.js"; // создание и поиск задачи

document.addEventListener('DOMContentLoaded', loadNotes);

newNoteBtn.addEventListener("click", showModal)
closeModalWindows.addEventListener('click', closModal)
addNewNote.addEventListener('click', newNote)
searchItem.addEventListener('input', searchNote)
btnSort.addEventListener('click', showMenuSort)

function showMenuSort(){
    allMenuNote.classList.toggle('open-menu-sort')
}

allNoteList.addEventListener('click', () => {
    btnSort.textContent = 'Все';
    allMenuNote.classList.remove('open-menu-sort')
    updateDisplay()
});

complitedNoteSort.addEventListener('click', () => {
    btnSort.textContent = 'Завершенные';
    allMenuNote.classList.remove('open-menu-sort')
    updateDisplay()
});

unComplitedNoteSort.addEventListener('click', () => {
    btnSort.textContent = 'Незавершенные';
    allMenuNote.classList.remove('open-menu-sort')
    updateDisplay()
});

document.addEventListener('click', (event) => {
    if (!btnSort.contains(event.target) && !allMenuNote.contains(event.target)) {
        allMenuNote.classList.remove('open-menu-sort')
    }
});


function newNote() {
    if(inpNewNote.value.length > 0){
        const newDiv = document.createElement('div')
        newDiv.classList.add('main__note-list')
            if(newDiv){
                const notId = Date.now()
                const notText = inpNewNote.value
                const noteObject = {
                    ID: notId,
                    text: notText,
                    completed: false,
                }
                arrList.push(noteObject)
                listNote.appendChild(newDiv)
                newDiv.innerHTML +=`<input type="checkbox" class="main__note-list-checkbox checkbox-inp" name="" id="">
            <h3>${inpNewNote.value}</h3>`
                const checkBoxNote = document.querySelectorAll('.checkbox-inp')
                checkBoxNote.forEach(check =>{
                    check.addEventListener('change', () => handleCheckboxChange(check, noteObject))
                })
            }
        modalWindows.classList.remove('open')
        inpNewNote.value = ""
        saveNotes();
        updateDisplay();
    }
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(arrList));
}

function showModal(){
    modalWindows.classList.add('open')
}

function closModal(){
    modalWindows.classList.remove('open')
}

function handleCheckboxChange(check, noteObject){
    const parentCheckBox = check.closest('.main__note-list');
    noteObject.completed = check.checked
    if(check.checked){
        parentCheckBox.classList.add('checked');
        noteObject.completed = true;
    }else{
        parentCheckBox.classList.remove('checked');
        noteObject.completed = false;
    }
}

function searchNote() {
    updateDisplay(); //
}

function updateDisplay() {
    const searchTerm = searchItem.value.toLowerCase();
    const sortType = btnSort.textContent;
    let filteredNotes = [...arrList];

    if (sortType === 'Завершенные') {
        filteredNotes = filteredNotes.filter(note => note.completed);
    } else if (sortType === 'Незавершенные') {
        filteredNotes = filteredNotes.filter(note => !note.completed);
    }

    filteredNotes = filteredNotes.filter(note => note.text.toLowerCase().includes(searchTerm));

    listNote.innerHTML = "";
    filteredNotes.forEach(note => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('main__note-list');
        newDiv.innerHTML = `<input type="checkbox" class="main__note-list-checkbox checkbox-inp" name="" id="${note.ID}" ${note.completed ? 'checked' : ''}>
            <h3>${note.text}</h3>`;
        listNote.appendChild(newDiv);
        const checkBoxNote = newDiv.querySelector('.checkbox-inp');
        checkBoxNote.addEventListener('change', () => handleCheckboxChange(checkBoxNote, note));
        if (note.completed) {
            newDiv.classList.add('checked');
        }
    });
}

function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        arrList.push(...JSON.parse(savedNotes));
        updateDisplay(); 
    }
}



