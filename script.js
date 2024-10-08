let authors = [];
let categories = [];
let mainContainer = document.querySelector("#container");
let authorSelect = document.querySelector("#authors");
let modal = document.querySelector('#default-modal');

document.querySelector('html').classList.add("text-[calc(3rem-clamp(1.5rem,3vw,2rem))]")

function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}


//hide modal where click outside it
document.addEventListener('click', function (event) {
    const outsideClick = !document.getElementById('modal-content').contains(event.target);
    const helpSectionClicked = document.getElementById('default-modal').contains(event.target)
    const defaultmodal = document.getElementById('default-modal')

    if (outsideClick && helpSectionClicked) {
        defaultmodal.classList.toggle("hidden")
    }
});


// show modal
function modalBook(book) {
    // create each dom element for modal
    const imgDOM = modal.querySelector('img');
    const titleDOM = modal.querySelector('h3');
    const authorsDOM = modal.querySelector('#authors-modal');
    const isbnDOM = modal.querySelector('#isbn-modal');
    const pagesDOM = modal.querySelector('#pages-modal');
    const dateDOM = modal.querySelector('#date-modal');
    const categoriesDOM = modal.querySelector('#categories-modal');
    const descriptionDOM = modal.querySelector('#description-modal');


    // fill each element of the modal
    titleDOM.innerHTML = book.title;
    if (typeof (book['thumbnailUrl']) != 'undefined' && book['thumbnailUrl'].length > 0) {
        imgDOM.src = book.thumbnailUrl;
        imgDOM.addEventListener("error", () => {
            imgDOM.src = 'https://p1.storage.canalblog.com/14/48/1145642/91330992_o.png';
        });
    }
    else {
        imgDOM.src = 'https://p1.storage.canalblog.com/14/48/1145642/91330992_o.png';
    }
    let authors = "";
    book.authors.forEach((author) => { authors += (author + ", ") });
    authorsDOM.innerHTML = `<strong>Authors : </strong>${authors.substring(0, authors.length - 2)}`;
    isbnDOM.innerHTML = `<strong>ISBN : </strong>${book.isbn}`;;
    pagesDOM.innerHTML = `<strong>Pages : </strong>${book.pageCount}`
    try {
        let date = Date.parse(book['publishedDate']['dt_txt']);
        let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
        let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        dateDOM.innerHTML = `<strong>Published date</strong> : ${day}-${month}-${year}`;
    }
    catch {
        dateDOM.innerHTML = `<strong>Published date</strong> : Unknown`;
    }
    let categories = "";
    book.categories.forEach((category) => { categories += (category + ", ") });
    categoriesDOM.innerHTML = `<strong>Categories : </strong>${categories.substring(0, categories.length - 2)}`

    descriptionDOM.innerHTML = `<strong>Description : </strong>${book.longDescription}`;;

    modal.classList.toggle("hidden");
    // reset scroll
    document.querySelector("#default-modal").scrollTop = 0;
}

// fill and add card to the DOM
function createCard(book) {
    let bookCard = document.createElement("article");

    bookCard.setAttribute("class", "book-card max-w-sm bg-white border border-gray-200 hover:border-gray-400 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-3 group cursor-pointer flex flex-col justify-between");
    let bookPicContainer = document.createElement('div');
    bookPicContainer.setAttribute("class", "w-1/2  m-auto rounded-lg overflow-hidden md:w-2/3 aspect-[15/18] flex flex-column items-center justify-center");
    let bookPic = document.createElement('img');
    bookPic.setAttribute("class", "w-full scale-scale-[105%] group-hover:scale-[110%] transition-all duration-300 grayscale-[30%] group-hover:grayscale-[-10%]");
    bookPic.src = book.thumbnailUrl;
    bookPicContainer.appendChild(bookPic);

    let readMore = document.createElement("button");

    let bookTitle = document.createElement("h3");
    bookTitle.setAttribute("class", "mb-4 text-xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white mt-2");
    let bookISBN = document.createElement("p");
    let bookDate = document.createElement("p");
    let bookNbPages = document.createElement("p");

    // fill each HTML element of the card
    if (typeof (book['thumbnailUrl']) != 'undefined' && book['thumbnailUrl'].length > 0) {
        bookPic.src = book['thumbnailUrl'];
        bookPic.addEventListener("error", () => {
            bookPic.src = 'https://p1.storage.canalblog.com/14/48/1145642/91330992_o.png';
        });
    }
    else {
        bookPic.src = 'https://p1.storage.canalblog.com/14/48/1145642/91330992_o.png';
    }
    bookTitle.innerHTML = book['title'];
    bookISBN.innerHTML = `<em>ISBN</em> : ${book['isbn']}`;

    try {
        let date = Date.parse(book['publishedDate']['dt_txt']);
        let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
        let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        bookDate.innerHTML = `<em>Published date</em> : ${day}-${month}-${year}`;
    }
    catch {
        bookDate.innerHTML = `<em>Published date</em> : Unknown`;
    }
    readMore.innerHTML = `Read more
             <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
            </svg>`
    readMore.setAttribute("class", "text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:text-black dark:bg-gray-100 dark:border dark:hover:bg-gray-200 dark:focus:ring-gray-200 mt-2 flex items-center")


    // append each element to the card
    bookCard.appendChild(bookPicContainer);
    let textContainer = document.createElement('div');
    textContainer.appendChild(bookTitle);
    textContainer.appendChild(bookISBN);
    textContainer.appendChild(bookDate);
    textContainer.appendChild(bookNbPages);
    textContainer.appendChild(readMore);
    bookCard.appendChild(textContainer);



    return bookCard;
}

async function loadMainFrame() {
    // Define the API endpoint
    const apiUrl = "./books.json";
    // Fetch JSON data from the API
    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse the JSON response
        })
        .then(async (data) => {


            const loader = mainContainer.querySelector(".loader");
            // display all datas
            var count = 0;
            let total = Object.keys(data).length;

            for (let index in data) {
                const loadOne = async () => {
                    count++;
                    const book = data[index];
                    let bookCard = createCard(book);
                    bookCard.addEventListener("click", () => {
                        modalBook(book)
                    });
                    mainContainer.insertBefore(bookCard, loader);

                    book.authors.forEach((author => { authors.push(author) }));
                    book.categories.forEach((category => { categories.push(category) }));

                    let authorsString = JSON.stringify(book.authors);
                    let categoriesString = JSON.stringify(book.categories);
                    bookCard.setAttribute("authors", authorsString);
                    bookCard.setAttribute("categories", categoriesString);
                }
                setTimeout(async () => {
                    loadOne();
                    if (count == total) {
                        if (mainContainer.contains(loader)) {
                            mainContainer.removeChild(loader);
                            loadAuthor();
                            loadCategory();
                        }
                    }
                }
                    , 1 * index);
            }
        })
        .then(

    )
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function loadAuthor() {
    return loadSelect("authors");
}

function loadCategory() {
    return loadSelect("categories");
}

function loadSelect(type) {
    let select, key;
    switch (type) {
        case "authors":
            select = document.querySelector("#authors");
            select.innerHTML = '';
            key = authors;
            break;
        case "categories":
            select = document.querySelector("#categories");
            select.innerHTML = '';
            key = categories;
            break;
    }
    let uniqueSelectList = key.filter(onlyUnique).sort();
    uniqueSelectList.forEach((obj => {
        const option = new Option(obj, obj);
        option.classList.add("max-w-full");
        select.appendChild(option);
    }));
    select.removeAttribute("disabled");

    select.addEventListener("change",
        () => {
            updateMainFrame(type, select);
        })
}

function updateMainFrame(type, select) {
    // reinit the other select
    switch (type) {
        case 'authors':
            document.querySelector("#categories").selectedIndex = 0;
            break;
        case 'categories':
            document.querySelector("#authors").selectedIndex = 0;
            break;
    }

    const cards = document.querySelectorAll(".book-card");
    const cardsArray = [...cards];
    const selected = select.options[select.selectedIndex].text;

    cardsArray.forEach(card => {
        const arrayType = JSON.parse(card.getAttribute(type));
        //  display all cards if nothing is selected
        if (select.selectedIndex == 0) {
            card.classList.remove("hidden");
        }
        // If card contains author / category and have hidden class
        else if (arrayType.includes(selected)) {
            // then show the card
            card.classList.remove("hidden");
        }
        // Else hide the card
        else {
            card.classList.add("hidden");
        }
    });
}

function switcher() {
    var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

    // Change the icons inside the button based on previous settings
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        themeToggleLightIcon.classList.remove('hidden');
    } else {
        themeToggleDarkIcon.classList.remove('hidden');
    }

    var themeToggleBtn = document.getElementById('theme-toggle');

    themeToggleBtn.addEventListener('click', function () {

        // toggle icons inside button
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');

        // if set via local storage previously
        if (localStorage.getItem('color-theme')) {
            if (localStorage.getItem('color-theme') === 'light') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            }

            // if NOT set via local storage previously
        } else {
            if (document.documentElement.classList.contains('dark')) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('color-theme', 'light');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('color-theme', 'dark');
            }
        }

    });
}

async function init() {

    // On page load or when changing themes, best to add inline in `head` to avoid FOUC
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark')
    }

    switcher()

    loadMainFrame();
    modal.querySelectorAll('.close-modal').forEach((btn) => { btn.addEventListener("click", () => { modal.classList.add("hidden") }) });
}


init()