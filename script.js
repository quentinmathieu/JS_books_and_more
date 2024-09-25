let authors = [];
let categories= [];
let mainContainer = document.querySelector("#container");
let authorSelect = document.querySelector("#authors");

document.querySelector('html').classList.add("text-[calc(3rem-clamp(1.5rem,3vw,2rem))]")

function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

// fill and add card to the DOM
function createCard(book){
    let bookCard = document.createElement("article");

    bookCard.setAttribute("class","book-card max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-2 group cursor-pointer");
    
    let bookPicContainer = document.createElement('div');
    bookPicContainer.setAttribute("class","w-1/2 m-auto rounded-lg overflow-hidden md:w-2/3");
    let bookPic = document.createElement('img');
    bookPic.setAttribute("class","w-full scale-scale-125 group-hover:scale-150 transition-all duration-300");
    bookPic.src = book.thumbnailUrl;
    bookPicContainer.appendChild(bookPic);
    
    let bookTitle= document.createElement("h3");
    bookTitle.setAttribute("class","mb-4 text-xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white mt-2");
    let bookISBN= document.createElement("p");
	let bookDate= document.createElement("p");
	let bookNbPages= document.createElement("p");

    // fill each HTML element of the card
    if (typeof(book['thumbnailUrl']) != 'undefined' && book['thumbnailUrl'].length > 0){
        bookPic.src = book['thumbnailUrl'];
    }
    else{
        bookPic.src =  'https://p1.storage.canalblog.com/14/48/1145642/91330992_o.png';
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
    catch{
        bookDate.innerHTML = `<em>Published date</em> : Unknown`;
    }
    


    // append each element to the card
    bookCard.appendChild(bookPicContainer);
    bookCard.appendChild(bookTitle);
    bookCard.appendChild(bookISBN);
    bookCard.appendChild(bookDate);
    bookCard.appendChild(bookNbPages);

    return bookCard;
}

async function loadMainFrame(){
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
    
    for (let index in data){
        const loadOne = async () => {
            count++;
            const book = data[index];
            let bookCard = createCard(book);
            
    
            mainContainer.insertBefore(bookCard, loader);

            book.authors.forEach((author => {authors.push(author)}));
            book.categories.forEach((category => {categories.push(category)}));
            
            let authorsString =  JSON.stringify(book.authors);
            let categoriesString = JSON.stringify(book.categories);
            bookCard.setAttribute("authors", authorsString);
            bookCard.setAttribute("categories", categoriesString);
        }
        setTimeout(async ()=>{
            loadOne();
            if (count == total){
                if (mainContainer.contains(loader)){
                    mainContainer.removeChild(loader);
                    loadAuthor();
                    loadCategory();
                }
            }
        }
        , 1*index);
    }  })
  .then(
    
  )
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
}

function loadAuthor(){
    return loadSelect("authors");
}

function loadCategory(){
    return loadSelect("categories");
}

function loadSelect(type){
    let select, key;
    switch(type){
        case "authors":
            select = document.querySelector("#authors");
            select.innerHTML='';
            key = authors;
            break;
        case "categories":
            select = document.querySelector("#categories");
            select.innerHTML='';
            key = categories;
            break;
    }
    let uniqueAuthors = key.filter(onlyUnique).sort();
    uniqueAuthors.forEach((obj => {
        const option = new Option (obj, obj);
        option.classList.add("max-w-full");
        select.appendChild(option); 
    }))

    select.addEventListener("change", 
        () =>
        {
            updateMainFrame(type, select);
        })
}

function updateMainFrame(type, select){
    // reinit the other select
    switch(type){
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

    cardsArray.forEach(card =>{
        const arrayType = JSON.parse(card.getAttribute(type));
        //  display all cards if nothing is selected
        if (select.selectedIndex == 0){
            card.classList.remove("hidden");
        }
        // If card contains author / category and have hidden class
        else if (arrayType.includes(selected)){
            // then show the card
            card.classList.remove("hidden");
        }
        // Else hide the card
        else{
            card.classList.add("hidden");
        }
    });
}

async function init(){
    loadMainFrame();
}


init()