// VARIABLES:
const quotesUrl = "http://localhost:3000/quotes"
const ulTag = document.querySelector('#quote-list')
const formTag = document.querySelector('#new-quote-form')
//------

// FUNCTIONS:
function quoteCard(quote){
  return `
  <li class='quote-card' data-id=${quote.id}>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  </li>
  `
};

function createQuote(quote, author) {
  // debugger
  const fetchObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      quote: quote,
      author: author,
      likes: 0
    })
  }
  return fetch(quotesUrl, fetchObj)
  .then(resp => resp.json())
};

function deleteQuote(id) {
  return fetch(quotesUrl + '/' + id, {method: "DELETE"})
};

function addLikes(id, currentLikes) {
  // debugger
  const fetchObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: currentLikes
    })
  };
  return fetch(quotesUrl + '/' + id, fetchObj)
  .then(resp => resp.json())
};
//-----

// EVENT LISTENERS:
formTag.addEventListener('submit', e => {
  e.preventDefault()
  let quote = e.target.quote.value
  let author = e.target.author.value
  if (e.target.id === 'new-quote-form') {
    createQuote(quote, author)
    .then(quote => {
      ulTag.innerHTML += quoteCard(quote)
    })
  }
});

ulTag.addEventListener('click', e => {
  const liTag = e.target.parentElement.parentElement
  if (e.target.className === 'btn-danger') {
    deleteQuote(liTag.dataset.id)
    .then(resp => {
      if (resp.ok) {
        liTag.remove()
      }
    })
  } else if (e.target.className === "btn-success") {
    let likesOnDOM = liTag.querySelector('span')
    let currentLikes = parseInt(liTag.querySelector('span').innerText) + 1
    addLikes(liTag.dataset.id, currentLikes)
    .then(updatedObj => {
      if (!!updatedObj) {
        likesOnDOM.innerText = currentLikes
      }
    })
  }


});
//-----

// GETs quotes:
fetch(quotesUrl)
.then(resp => resp.json())
.then(quotes => {
  quotes.forEach(quote => {
    ulTag.innerHTML += quoteCard(quote)
  });
});
//-----
