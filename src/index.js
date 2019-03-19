const ulTag = document.querySelector('#quote-list');
const newQuoteForm = document.querySelector('#new-quote-form');

// our functions
const createQuoteCard = quote => {
  return (
  `
    <li class='quote-card' data-id="${quote.id}">
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    </li>
  `
  )
};

const createNewQuotes = (quote, author) => {
  const settings = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      quote: quote,
      author: author,
      likes: 0
    })
  }

  fetch('http://localhost:3000/quotes', settings)
    .then(response => response.json())
    .then(newQuote => {
      ulTag.innerHTML = createQuoteCard(newQuote) + ulTag.innerHTML;
    })
}

const deleteQuote = id => {
  return fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'DELETE'
  })
}

const increaseLike = (id, currentLikes) => {
  return fetch(`http://localhost:3000/quotes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      likes: currentLikes
    })
  }).then(response => response.json())
}


// event listeners
newQuoteForm.addEventListener('submit', e => {
  e.preventDefault();
  let quote = e.target.quote.value;
  let author = e.target.author.value;
  createNewQuotes(quote, author);
});

ulTag.addEventListener('click', e => {
  let closestLi = e.target.closest('li');
  if (e.target.className === 'btn-danger') {
    deleteQuote(closestLi.dataset.id).then(response => {
      if(response.ok) {
        closestLi.remove();
      }
    })
  } else if (e.target.className === 'btn-success') {
    // found current likes
    let likeAmountonDOM = e.target.querySelector('span');
    let currentLikes = parseInt(e.target.querySelector('span').innerText) + 1;
    // update backend
    increaseLike(closestLi.dataset.id, currentLikes)
      .then(updatedQuoteObj => {
        if (!!updatedQuoteObj) {
          // update DOM
          likeAmountonDOM.innerText = currentLikes;
        }
      })
  }
});




// code that actually just runs
fetch('http://localhost:3000/quotes').then(response => response.json()).then(quotesObjs => {
  quotesObjs.forEach(quote => {
    ulTag.innerHTML += createQuoteCard(quote);
  })
})