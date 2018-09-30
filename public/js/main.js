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

function updateGameState(game) {
    console.log(player.id)
    if(game.status === 'finish') {
        if(game.winner[player.id].points > 0) winModal.style.display = 'inherit'
        else loseModal.style.display = 'inherit'
    }
}

function selectOption(option) {
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