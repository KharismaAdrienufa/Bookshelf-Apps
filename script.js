const books = []
const RENDER_EVENT = 'render_book';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function addBook() {
    const titleBook = document.getElementById('addTitle').value;
    const authorBook = document.getElementById('addAuthor').value;
    const yearBook = document.getElementById('addYear').value;
    const isCompleted = document.getElementById('isComplete').checked;

    const generatedId = generateId();
    const bookObject = generateBookObject(generatedId, titleBook, authorBook, yearBook, isCompleted);    
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT)); /*render date in array*/
}

function makeBook(bookObject) {
    const {id, title, author, year, isComplete} = bookObject;

    const bookTitle = document.createElement('p');
    bookTitle.innerText = title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = author;

    const bookYear = document.createElement('p');
    bookYear.innerText = year;
    
    const deleteIcon = document.createElement('icon');
    deleteIcon.innerText = 'delete';

    const buttonContainer = document.createElement('button');
    const buttonItem = document.createElement('li');

    if (isComplete) {
        const undoIcon = document.createElement('icon');
        undoIcon.classList.add('mini cream material-icons');
        undoIcon.innerText = 'undo';
        
        deleteIcon.classList.add('mini cream material-icons');
        
        buttonContainer.classList.add('choco card-button');
        
        const undoButton = buttonContainer.append(undoIcon);
        const deleteButton = buttonContainer.append(deleteIcon);
        
        buttonItem.append(undoButton, deleteButton);
    } else {
        const checkIcon = document.createElement('icon');
        checkIcon.classList.add('mini choco material-icons');
        checkIcon.innerText = 'check';
        
        deleteIcon.classList.add('mini choco material-icons');
        
        buttonContainer.classList.add('cream card-button');
        
        const checkButton = buttonContainer.append(checkIcon);
        const deleteButton = buttonContainer.append(deleteIcon);
        
        buttonItem.append(checkButton, deleteButton);
    }

    const listButton = document.createElement('ul');
    listButton.append(buttonItem);

    const bookCard = document.createElement('div');
    bookCard.classList.add('choco card');
    bookCard.append(listButton, bookTitle, bookAuthor, bookYear);
    
    const bookFlex = document.createElement('div');
    bookFlex.classList.add('mini-flex');
    bookFlex.append(bookCard);
}

document.addEventListener('DOMContentLoaded', () => {

    const submitForm = document.getElementById('inputForm');
    submitForm.addEventListener('submit', (event) => {
        event.preventDefault(); /*saving data*/
        addBook();
    });
});

document.addEventListener(RENDER_EVENT, () => {
    console.log(books);
});

