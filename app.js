const inputElement = document.getElementById('title');
const createBtn = document.getElementById('create');
const listElement = document.getElementById('list');

// Ключ для проверки, были ли уже добавлены кастомные заметки
const customNotesKey = 'customNotesAdded';

// Проверяем, были ли уже добавлены кастомные заметки
const customNotesAdded = localStorage.getItem(customNotesKey);

// Если кастомные заметки еще не были добавлены, добавляем их и устанавливаем флаг
if (!customNotesAdded) {
    const customNotes = [
        {
            title: 'То',
            completed: false,
        },
        {
            title: 'сё',
            completed: false,
        },
        {
            title: '5',
            completed: false,
        },
        {
            title: '10',
            completed: false,
        },
    ];

    const notes = loadNotes();
    notes.push(...customNotes);
    saveNotes(notes);
    localStorage.setItem(customNotesKey, 'true');
}

// Загрузка списка заметок из Local Storage при загрузке страницы
function loadNotes() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        return JSON.parse(storedNotes);
    }
    return [];
}

// Сохранение списка заметок в Local Storage
function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Объединяем кастомные заметки и заметки из Local Storage
let notes = loadNotes();

// Функция для рендеринга списка заметок
function render() {
    listElement.innerHTML = '';
    if (notes.length === 0) {
        listElement.innerHTML = '<p>Нет заметок</p>';
    }
    for (let i = 0; i < notes.length; i++) {
        listElement.insertAdjacentHTML("beforeend", getNoteTemplate(notes[i], i));
    }
}

render();

createBtn.onclick = function () {
    if (inputElement.value.length === 0) {
        return;
    }

    const newNote = {
        title: inputElement.value,
        completed: false,
    };
    notes.push(newNote);
    inputElement.value = '';
    render();
    saveNotes(notes); // Сохранение после добавления
};

listElement.onclick = function (event) {
    if (event.target.dataset.index) {
        const index = parseInt(event.target.dataset.index);
        const type = event.target.dataset.type;
        if (type === 'toggle') {
            notes[index].completed = !notes[index].completed;
        } else if (type === 'remove') {
            notes.splice(index, 1);
        }
        render();
        saveNotes(notes); // Сохранение после изменений
    }
};

function getNoteTemplate(note, index) {
    return `<li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="${note.completed ? 'text-decoration-line-through' : ''}">${note.title}</span>
        <span>
            <span class="btn btn-small btn-${note.completed ? 'warning' : 'success'}" data-index=${index} data-type="toggle">&check;</span>
            <span class="btn btn-small btn-danger" data-index=${index} data-type="remove">&times;</span>
        </span>
    </li>`;
}
