// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

const quoteListUlTag = document.querySelector('#quote-list');
const newQuoteFormTag = document.querySelector('#new-quote-form')

const quotesCard = (quote) => {
    return `<li class='quote-card' data-id=${quote.id}>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span data-likes=${quote.likes}>${quote.likes}</span></button>
      <button class='btn-danger'>Delete</button>
    </blockquote>
  </li>`
}


fetch('http://localhost:3000/quotes')
.then(response => response.json())
.then(quotesObj => quotesObj.forEach(quote => {
    quoteListUlTag.innerHTML += quotesCard(quote)
}))

const createQuoteFetch = (quote, author) => {
    return fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            quote: quote,
            author: author,
            likes: 0
        })
    })
}

newQuoteFormTag.addEventListener('submit', (event) => {
    event.preventDefault();
    const quote = event.target.quote.value;
    const author = event.target.author.value;
    createQuoteFetch(quote, author)
    .then(resp => resp.json())
    .then(newQuoteObj => {

        quoteListUlTag.innerHTML += quotesCard(newQuoteObj)
    })
})

const deleteQuoteFetch = (quoteId) => {
    return fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
}

const updateQuoteFetch = (quoteId, likeCount) => {
    return fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            likes: likeCount
        })
    })
}

quoteListUlTag.addEventListener('click', (event) => {
    //debugger
    if (event.target.textContent === 'Delete') {
        const id = event.target.parentElement.parentElement.dataset.id;
        deleteQuoteFetch(id)
        .then(resp => resp.json())
        .then( () => {
            event.target.parentElement.parentElement.remove()
        })
    } else if (event.target.tagName === "BUTTON") {
         //console.log('yep you got me')
        //add updatefetch helper function
        const likeCount = parseInt(event.target.children[0].dataset.likes)+1;
        const id = event.target.parentElement.parentElement.dataset.id;
        updateQuoteFetch(id, likeCount)
        .then(resp => resp.json())
        .then(updatedLikesObj => {
            event.target.children[0].dataset.likes = updatedLikesObj.likes
            event.target.children[0].innerText = `${updatedLikesObj.likes}`
        })
    }
})
