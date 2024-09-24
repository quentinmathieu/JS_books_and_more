let authors, categories, datas;
let mainContainer = document.querySelector("#container");

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
        // break;
        const loadOne = async () => {
            count++;
            const book = data[index];
            let bookCard = document.createElement("article");

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
                bookPic.src =  'https://p1.storage.canalblog.com/14/48/1145642/91330992_o.png?';
            }
    
            bookCard.appendChild(bookPic);
            bookCard.appendChild(bookTitle);
            // bookCard.appendChild(bookISBN);
            // bookCard.appendChild(bookDate);
            // bookCard.appendChild(bookNbPages);
            // bookCard.appendChild(bookDescription);
            // bookCard.appendChild(bookDescription);
    
            mainContainer.insertBefore(bookCard, loader);
            window.scrollTo(0, document.body.scrollHeight);
        }
        // loadOne();
        setTimeout(async ()=>{
            loadOne();
            await loadOne;
            if (count == total){
                if (mainContainer.contains(loader)){
                    mainContainer.removeChild(loader);
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
    return loadSelect("author");
}

function loadCategory(){
    return loadSelect("category");
}

function loadSelect(type){
    let select, key;
    switch(type){
        case "author":
            select = document.querySelector("#author");
            key = "categories";
            break;
        case "category":
            select = document.querySelector("#category");
            key = "authors";
            break;
    }
    console.log(select);
}




function init(){
    loadMainFrame();
    loadAuthor();
    loadCategory();
}



init()