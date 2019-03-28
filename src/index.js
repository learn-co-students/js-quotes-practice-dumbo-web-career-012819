const quoteList = document.querySelector('#quote-list');
const formTag = document.querySelector('#new-quote-form');

const quoteCard = quote => {
return `<li class='quote-card' data-id=${quote.id}>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success' data-id=${quote.id}>Likes: <span>${quote.likes}</span></button>
      <button class='btn-danger' data-id=${quote.id}>Delete</button>
      <button class='btn-edit' data-id=${quote.id}>Edit</button>
    </blockquote>
  </li>`
}

fetch('http://localhost:3000/quotes')
.then(resp => resp.json())
.then(quoteObjs => (quoteObjs.forEach(quote => {
    quoteList.innerHTML = quoteCard(quote) + quoteList.innerHTML
})))


const newAuthorFetch = (quote, author) => {
    return fetch('http://localhost:3000/quotes' , {
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


const deleteQuoteFetch = (id) => {
    return fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE'
    })
}

const updateLikeFetch = (id, likesUp) => {
    return fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            likes: likesUp
        })
    })
}

//const updateQuoteFetch = (id, quote, author)




formTag.addEventListener('submit', (e) => {
    e.preventDefault();
    const newQuote = e.target.quote.value;
    const newAuthor = e.target.author.value;
    newAuthorFetch(newQuote, newAuthor).then(resp => resp.json())
    .then(newObj => {
        quoteList.innerHTML = quoteCard(newObj) + quoteList.innerHTML
    })
})

quoteList.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (e.target.classList.contains("btn-danger")) {
        deleteQuoteFetch(id).then(resp => resp.json())
        .then(e.target.parentElement.parentElement.remove())
    }
    else if (e.target.classList.contains('btn-success')) {
        const likesUp = parseInt(e.target.querySelector('span').innerText) + 1;
        updateLikeFetch(id, likesUp).then(resp => resp.json())
        .then(update => {
            e.target.querySelector('span').innerText = `${update.likes}`
        })
    } else if (e.target.classList.contains('btn-edit')) {
        debugger
    }
})









































// const quoteListUlTag = document.querySelector('#quote-list');
// const newQuoteFormTag = document.querySelector('#new-quote-form')
//
// const quotesCard = (quote) => {
//     return `<li class='quote-card' data-id=${quote.id}>
//     <blockquote class="blockquote">
//       <p class="mb-0">${quote.quote}</p>
//       <footer class="blockquote-footer">${quote.author}</footer>
//       <br>
//       <button class='btn-success'>Likes: <span data-likes=${quote.likes}>${quote.likes}</span></button>
//       <button class='btn-danger'>Delete</button>
//     </blockquote>
//   </li>`
// }
//
//
// fetch('http://localhost:3000/quotes')
// .then(response => response.json())
// .then(quotesObj => quotesObj.forEach(quote => {
//     quoteListUlTag.innerHTML += quotesCard(quote)
// }))
//
// const createQuoteFetch = (quote, author) => {
//     return fetch('http://localhost:3000/quotes', {
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//         },
//         body: JSON.stringify({
//             quote: quote,
//             author: author,
//             likes: 0
//         })
//     })
// }
//
// newQuoteFormTag.addEventListener('submit', (event) => {
//     event.preventDefault();
//     const quote = event.target.quote.value;
//     const author = event.target.author.value;
//     createQuoteFetch(quote, author)
//     .then(resp => resp.json())
//     .then(newQuoteObj => {
//
//         quoteListUlTag.innerHTML += quotesCard(newQuoteObj)
//     })
// })
//
// const deleteQuoteFetch = (quoteId) => {
//     return fetch(`http://localhost:3000/quotes/${quoteId}`, {
//         method: 'DELETE',
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//         }
//     })
// }
//
// const updateQuoteFetch = (quoteId, likeCount) => {
//     return fetch(`http://localhost:3000/quotes/${quoteId}`, {
//         method: 'PATCH',
//         headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//         },
//         body: JSON.stringify({
//             likes: likeCount
//         })
//     })
// }
//
// quoteListUlTag.addEventListener('click', (event) => {
//     //debugger
//     if (event.target.textContent === 'Delete') {
//         const id = event.target.parentElement.parentElement.dataset.id;
//         deleteQuoteFetch(id)
//         .then(resp => resp.json())
//         .then( () => {
//             event.target.parentElement.parentElement.remove()
//         })
//     } else if (event.target.tagName === "BUTTON") {
//          //console.log('yep you got me')
//         //add updatefetch helper function
//         const likeCount = parseInt(event.target.children[0].dataset.likes)+1;
//         const id = event.target.parentElement.parentElement.dataset.id;
//         updateQuoteFetch(id, likeCount)
//         .then(resp => resp.json())
//         .then(updatedLikesObj => {
//             event.target.children[0].dataset.likes = updatedLikesObj.likes
//             event.target.children[0].innerText = `${updatedLikesObj.likes}`
//         })
//     }
// })
//====================sort method=====================
// const bands = [
//   { genre: 'Rap', band: 'Migos', albums: 2},
//   { genre: 'Pop', band: 'Coldplay', albums: 4},
//   { genre: 'Rock', band: 'Breaking Benjamins',
//     albums: 1}
// ];
// function compare(a, b) {
//   const genreA = a.band.toUpperCase();
//   const genreB = b.band.toUpperCase();
//
//   let comparison = 0;
//   if (genreA > genreB) {
//     comparison = 1;
//   } else if (genreA < genreB) {
//     comparison = -1;
//   }
//   return comparison;
// }
// console.log(bands.sort(compare));
