let authors = [];
let categories= [];
let mainContainer = document.querySelector("#container");
let authorSelect = document.querySelector("#authors");

function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
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
            let bookCard = document.createElement("article");
            bookCard.classList.add("book-card");

            let bookPic = document.createElement('img');
            bookPic.src = book.thumbnailUrl;
            document.body.appendChild(bookPic);
            
            let bookTitle= document.createElement("h3");
            // let bookISBN, bookDate, bookNbPages, bookDescription= document.createElement("p");
            
            bookTitle.innerHTML = book['title'];
            if (typeof(book['thumbnailUrl']) != 'undefined' && book['thumbnailUrl'].length > 0){
                bookPic.src = book['thumbnailUrl'];
            }
            else{
                bookPic.src =  'https://p1.storage.canalblog.com/14/48/1145642/91330992_o.png';
            }
    
            bookCard.appendChild(bookPic);
            bookCard.appendChild(bookTitle);
            // bookCard.appendChild(bookISBN);
            // bookCard.appendChild(bookDate);
            // bookCard.appendChild(bookNbPages);
            // bookCard.appendChild(bookDescription);
            // bookCard.appendChild(bookDescription);


    
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
            console.log("0")
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