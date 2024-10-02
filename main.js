// Do your work here...
const storageKey = 'BOOK_COLLECTION';

const incompleteBookList = document.getElementById('incompleteBookList');

const completeBookList = document.getElementById('completeBookList');

const bookForm = document.getElementById('bookForm');

const isCompleteCheckbox = document.getElementById('bookFormIsComplete');

const searchForm = document.getElementById('searchBook');

let books = [];

const Book = (title, author, year, isComplete) => {
  return {
    id: new Date().getTime(),
    title,
    author,
    year,
    isComplete,
  };
};

const createNewBook = (book) => {
  /**
   * @returns HTMLElement: \<div data-bookid="{{ ID_buku }}" data-testid="bookItem">
   */
  const newBookElement = document.createElement('div');
  newBookElement.setAttribute('data-bookid', book.id);
  newBookElement.setAttribute('data-testid', 'bookItem');
  newBookElement.setAttribute('class', 'card');

  /**
   * @returns HTMLElement: \<h3 data-testid="bookItemTitle">{{ judul_buku }}\</h3>
   */
  const newTitleElement = document.createElement('h3');
  newTitleElement.setAttribute('data-testid', 'bookItemTitle');
  newTitleElement.innerText = book.title;
  newTitleElement.setAttribute('class', 'card-header-title');

  /**
   * @returns HTMLElement: \<p data-testid="bookItemAuthor">Penulis: {{ penulis_buku }}\</p>
   *
   */
  const newAuthorElement = document.createElement('p');
  newAuthorElement.setAttribute('data-testid', 'bookItemAuthor');
  newAuthorElement.innerText = `Penulis: ${book.author}`;
  newAuthorElement.setAttribute('class', 'mb-2 ml-4');

  /**
   * @returns HTMLElement: \<p data-testid="bookItemYear">Tahun: {{ tahun_rilis_buku }}\</p>
   *
   */
  const newYearElement = document.createElement('p');
  newYearElement.setAttribute('data-testid', 'bookItemYear');
  newYearElement.innerText = `Tahun: ${book.year}`;
  newYearElement.setAttribute('class', 'mb-2 ml-4');

  /**
   *
   * @returns HTMLElement: \<div>
   *\<button data-testid="bookItemIsCompleteButton">{{ tombol_untuk_ubah_kondisi }}\</button>
   *\<button data-testid="bookItemDeleteButton">{{ tombol_untuk_hapus }}\</button>
   *\<button data-testid="bookItemEditButton">{{ tombol_untuk_edit }}\</button>
   *\</div>
   *
   */
  const newBtnGroupElement = document.createElement('div');
  newBtnGroupElement.setAttribute('class', 'card-footer');
  const newCompleteBtnElement = document.createElement('button');
  newCompleteBtnElement.setAttribute('data-testid', 'bookItemIsCompleteButton');
  newCompleteBtnElement.innerText = book.isComplete ? 'Belum Selesai Dibaca' : 'Selesai Dibaca';
  const completeBtnTxtColor = book.isComplete ? 'has-text-warning' : 'has-text-primary';
  newCompleteBtnElement.setAttribute('class', `card-footer-item ${completeBtnTxtColor}`);
  const newDeleteBtnElement = document.createElement('button');
  newDeleteBtnElement.setAttribute('data-testid', 'bookItemDeleteButton');
  newDeleteBtnElement.innerText = 'Hapus Buku';
  newDeleteBtnElement.setAttribute('class', 'card-footer-item has-text-danger');
  const newEditBtnElement = document.createElement('button');
  newEditBtnElement.setAttribute('data-testid', 'bookItemEditButton');
  newEditBtnElement.innerText = 'Edit Buku';
  newEditBtnElement.setAttribute('class', 'card-footer-item');

  /**
   * appending all new created elements
   */

  newBtnGroupElement.append(newCompleteBtnElement, newEditBtnElement, newDeleteBtnElement);

  newBookElement.append(newTitleElement, newAuthorElement, newYearElement, newBtnGroupElement);

  return newBookElement;
};

const insertBook = (bookItem, book) => {
  if (book.isComplete) {
    completeBookList.append(bookItem);
  } else {
    incompleteBookList.append(bookItem);
  }
};

const addEventListenertoBtns = (bookItem) => {
  // add event listener to isComplete btn
  bookItem.childNodes[3].childNodes[0].addEventListener('click', (e) => {
    const data_testid = e.target.parentNode.parentNode.getAttribute('data-bookid');
    const bookIndex = books.findIndex((x) => x.id == data_testid);
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    localStorage.setItem(storageKey, JSON.stringify(books));
    bookItem.remove();
    location.reload();
  });

  // add event listener to delete btn
  bookItem.childNodes[3].childNodes[2].addEventListener('click', (e) => {
    const data_testid = e.target.parentNode.parentNode.getAttribute('data-bookid');
    const bookIndex = books.findIndex((x) => x.id == data_testid);
    books.splice(bookIndex, 1);
    localStorage.setItem(storageKey, JSON.stringify(books));
    bookItem.remove();
  });
};

isCompleteCheckbox.addEventListener('change', (e) => {
  isCompleteCheckbox.parentNode.nextSibling.nextSibling.childNodes[0].nextSibling.innerText = isCompleteCheckbox.checked
    ? 'Selesai dibaca'
    : 'Belum selesai dibaca';
  e.preventDefault();
});

bookForm.addEventListener('submit', (e) => {
  // retrieve form data
  const title = document.getElementById('bookFormTitle');
  const author = document.getElementById('bookFormAuthor');
  const year = document.getElementById('bookFormYear');
  const isComplete = document.getElementById('bookFormIsComplete');

  const newBook = Book(title.value, author.value, parseInt(year.value), isComplete.checked);

  // create new book item
  const newBookItem = createNewBook(newBook);

  // save to localStorage

  books.push(newBook);
  localStorage.setItem(storageKey, JSON.stringify(books));

  // append to the list
  insertBook(newBookItem, newBook);
  addEventListenertoBtns(newBookItem);

  // reset form
  title.value = '';
  author.value = '';
  year.value = '';
  isComplete.checked = false;

  e.preventDefault();
});

searchForm.addEventListener('submit', (e) => {
  const title = document.getElementById('searchBookTitle').value;
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const pattern = new RegExp(`^${escapedTitle}`, 'i');
  const result = books.filter((book) => pattern.test(book.title));

  for (const item of incompleteBookList.children) {
    console.log(item);
    if (result.findIndex((x) => x.id == item.getAttribute('data-bookid')) == -1) {
      console.log('none');
      item.style.display = 'none';
    } else {
      item.style.display = 'block';
    }
  }

  for (const item of completeBookList.children) {
    console.log(item);
    if (result.findIndex((x) => x.id == item.getAttribute('data-bookid')) == -1) {
      console.log('none');
      item.style.display = 'none';
    } else {
      item.style.display = 'block';
    }
  }
  // reset form
  document.getElementById('searchBookTitle').value = '';

  e.preventDefault();
});

window.addEventListener('load', (e) => {
  books = JSON.parse(localStorage.getItem(storageKey));

  // 'books' is always an array by default
  if (books === null) {
    books = [];
  }

  // auto populate bookshelf from localStorage
  for (const book of books) {
    const bookItem = createNewBook(book);
    insertBook(bookItem, book);
    addEventListenertoBtns(bookItem);
  }

  console.log(books);
  e.preventDefault();
});
