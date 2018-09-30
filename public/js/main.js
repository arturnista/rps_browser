let game = null
let player = null
let winModal = null
let loseModal = null

window.onload = () => {
    winModal = document.getElementById("win-modal")
    loseModal = document.getElementById("lose-modal")

    let gameId = window.location.search.match(/[\?\&]game=[^\?^\&]*/g)
    if(gameId) gameId = gameId[0].replace('?game=', '')

    if(gameId) {
        fetch('/game', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ game: gameId })
        })
        .then(res => res.json())
        .then(res => {
            game = res.game
            player = res.player
        })
    } else {
        fetch('/game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            game = res.game
            player = res.player
        })
    }
}

function selectOption(option) {
    fetch('/option', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ option, game: game.id })
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
    })
    // winModal.style.display = 'inherit'
}