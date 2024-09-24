let authors, categories, datas;
let mainContainer = document.querySelector("#container");
// let defaultImg =  new Image();
// defaultImg.crossOrigin = "anonymous";
// defaultImg.src =  'https://p1.storage.canalblog.com/14/48/1145642/91330992_o.png?';

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

            // bookPic = new Image();
            // bookPic.crossOrigin = "anonymous";
            // bookPic.addEventListener("load", imageReceived, false);
            
            // // bookPic.setAttribute('crossOrigin', 'anonymous');
            let bookTitle= document.createElement("h3");
            // let bookISBN, bookDate, bookNbPages, bookDescription= document.createElement("p");
            
            bookTitle.innerHTML = book['title'];
            // if (book['thumbnailUrl'].length > 0){
            //     bookPic.src =  'https://p1.storage.canalblog.com/14/48/1145642/91330992_o.png?';
            // }
            // else{
            //     bookPic.src = book['thumbnailUrl']+"?test";
            // }
    
            // bookCard.appendChild(bookPic);
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
        const myTimeout = setTimeout(async ()=>{
            loadOne();
            await loadOne;
            if (count == total){
                if (mainContainer.contains(loader)){
                    mainContainer.removeChild(loader);
                }
            }
        }
        , 10*index);
    }
    // delete the loader (spinner) after loading & displaying all datas)
  })
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