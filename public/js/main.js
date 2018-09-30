let game = null
let player = null
let winModal = null
let loseModal = null
let lastRoundNumber = 0

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
            player = { id: res.player }
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
            player = { id: res.player }

            document.getElementById('enter-game-link').setAttribute('href', `/?game=${game.id}`)
            document.getElementById('enter-game-input').setAttribute('value', `${window.location.origin}/?game=${game.id}`)
        })
    }

    setInterval(function() {

        fetch(`/game?game=${game.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(updateGameState)

    }, 1000)
}

function updateGameState(currentGameState) {
    if(currentGameState.round !== game.round) {
        const winnerData = currentGameState.lastRound.find(x => x.id == player.id)
        if(winnerData.points > 0) winModal.style.display = 'inherit'
        else loseModal.style.display = 'inherit'

        game = currentGameState

        setTimeout(restartGame, 3000)
    }
}

function restartGame() {
    winModal.style.display = 'none'
    loseModal.style.display = 'none'

    const docs = document.getElementsByClassName("option")
    for (let i = 0; i < docs.length; i++) {
        docs[i].classList.remove('not-selected')
        docs[i].classList.remove('selected')
    }
}

function selectOption(option) {
    const docs = document.getElementsByClassName("option")
    for (let i = 0; i < docs.length; i++) {
        docs[i].classList.add('not-selected')
    }
    const removeDoc = document.getElementById(option)
    removeDoc.classList.remove('not-selected')
    removeDoc.classList.add('selected')
    
    fetch('/game/option', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ option, game: game.id, player: player.id })
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
    })
    // winModal.style.display = 'inherit'
}