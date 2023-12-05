const books = []
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'book-storage'
const SAVED_EVENT = 'save-book';

function storage() {
    if (typeof(Storage) === 'undefined') {
        alert('browser doesn\'t support local storage');
        return false;
    } else {
        return true;
    }
}

function save() {
    if (storage()) {
        const bookStrParsed = JSON.stringify(books); /*parse object to JSON string*/
        localStorage.setItem(STORAGE_KEY, bookStrParsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function load() {
    const bookStorage = localStorage.getItem(STORAGE_KEY);
    let bookObjParsed = JSON.parse(bookStorage);

    if (bookObjParsed !== null) {
        for (const book of bookObjParsed) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

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

function findBook(bookId) {
    for (bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function addBook() {
    const titleBook = document.getElementById('addTitle').value;
    const authorBook = document.getElementById('addAuthor').value;
    const yearBook = document.getElementById('addYear').value;
    const isCompleted = document.getElementById('complete').checked;

    const generatedId = generateId();
    const bookObject = generateBookObject(generatedId, titleBook, authorBook, yearBook, isCompleted);    
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT)); /*render data in array*/
    save()
}

function checkBook(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    save();
}

function deleteBook(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == -1) return;
    
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    save();
}

function undoBook(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
    
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    save();
}

function makeBook(bookObject) {
    const {id, title, author, year, isComplete} = bookObject;

    const bookTitle = document.createElement('h3');
    bookTitle.innerText = title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = author;

    const bookYear = document.createElement('p');
    bookYear.innerText = year;
    
    const deleteIcon = document.createElement('icon');
    deleteIcon.innerText = 'delete';

    const buttonItem = document.createElement('li');
    const bookCard = document.createElement('div');

    if (isComplete) {
        const undoIcon = document.createElement('icon');
        undoIcon.classList.add("mini", "cream-button", "material-icons");
        undoIcon.innerText = 'undo';

        const undoButton = document.createElement('button');
        undoButton.append(undoIcon);
        undoButton.classList.add("choco", "card-button");
        undoButton.addEventListener('click', () => {
            undoBook(id);
        })
 
        deleteIcon.classList.add("mini", "cream-button", "material-icons");
        
        const deleteButton = document.createElement('button');
        deleteButton.append(deleteIcon);
        deleteButton.classList.add("choco", "card-button");
        deleteButton.addEventListener('click', () => {
            deleteBook(id);
        })

        buttonItem.append(undoButton, deleteButton);
        
        const listButton = document.createElement('ul');
        listButton.append(buttonItem);
    
        bookCard.classList.add("cream", "card");
        bookCard.append(listButton, bookTitle, bookAuthor, bookYear);
    } else {
        const checkIcon = document.createElement('icon');
        checkIcon.classList.add("mini", "choco-button", "material-icons");
        checkIcon.innerText = 'check';

        const checkButton = document.createElement('button');
        checkButton.append(checkIcon);
        checkButton.classList.add("cream", "card-button");
        checkButton.addEventListener('click', () => {
            checkBook(id);
        })
        
        deleteIcon.classList.add("mini", "choco-button", "material-icons");
        
        const deleteButton = document.createElement('button');
        deleteButton.append(deleteIcon);
        deleteButton.classList.add("cream", "card-button");
        deleteButton.addEventListener('click', () => {
            deleteBook(id);
        })
        
        buttonItem.append(checkButton, deleteButton);

        const listButton = document.createElement('ul');
        listButton.append(buttonItem);
        
        bookCard.classList.add("choco", "card");
        bookCard.append(listButton, bookTitle, bookAuthor, bookYear);
    }
    
    return bookCard;
}

function searchBook() {
    const title = document.getElementById('searchTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.card > h3');

    for (book of bookList) {
        if (title !== "") {
            if (title === book.innerText.toLowerCase()) {
                book.parentElement.removeAttribute('hidden');
            } else if (book.innerText.toLowerCase().includes(title)) {
                book.parentElement.removeAttribute('hidden');
            } else {
                book.parentElement.setAttribute('hidden',true);
            }
        } else {
            book.parentElement.removeAttribute('hidden');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const submitForm = document.getElementById('inputForm');
    submitForm.addEventListener('submit', (event) => {
        event.preventDefault(); /*saving data*/
        addBook();
    });

    if (storage()) {
        load();
    }

    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        searchBook();
    });
});

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
})

document.addEventListener(RENDER_EVENT, () => {
    const uncompletedBookList = document.getElementById('uncompleted-books');
    const completedBookList = document.getElementById('completed-books');
    
    uncompletedBookList.innerHTML = '';
    completedBookList.innerHTML = '';
    
    for (bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete) {
            completedBookList.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});

