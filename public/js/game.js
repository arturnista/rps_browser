let game = null
let player = null
let endRoundModal = null
let pointsSpan = null
let lastRoundNumber = 0

let playersAgainst = 0

window.onload = () => {
    endRoundModal = document.getElementById("end-round-modal")
    pointsSpan = document.getElementById("points-span")

    let gameId = window.location.search.match(/[\?\&]game=[^\?^\&]*/g)
    if(gameId) gameId = gameId[0].replace('?game=', '')

    // If the gameID is defined
    if(gameId) {
        // Enter in a room
        fetch('/api/game', {
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

            const playerNameText = document.getElementById('player-name')
            playerNameText.textContent = `Player ${player.id}`
        })
    } else {
        fetch('/api/game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            game = res.game
            player = { id: res.player }

            const playerNameText = document.getElementById('player-name')
            playerNameText.textContent = `Player ${player.id}`

            document.getElementById('enter-game-link').setAttribute('href', `/?game=${game.id}`)
            document.getElementById('enter-game-input').setAttribute('value', `${window.location.origin}/?game=${game.id}`)
        })
    }

    setInterval(function() {

        fetch(`/api/game?game=${game.id}`, {
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
    // If the players amount has changed
    if(currentGameState.players.length > 1 && playersAgainst !== currentGameState.players.length) {
        const playerNameText = document.getElementById('versus-player-name')
        if(currentGameState.players.length === 2) {
            const otherPlayer = currentGameState.players.find(x => x.id != player.id)
            playerNameText.textContent = `Player ${otherPlayer.id}`
        } else {
            playerNameText.textContent = `${currentGameState.players.length - 1} players`
        }

        playersAgainst = currentGameState.players.length
    }

    // If a round ended
    if(currentGameState.round !== game.round) {
        // Find if you won any points
        const yourData = currentGameState.lastRound.find(x => x.id == player.id)
        
        if(yourData.points > 0) {
            pointsSpan.textContent = `You won ${yourData.points} POINT${yourData.points > 1 ? 'S': ''}`
            endRoundModal.classList.add('win')
        } else {
            pointsSpan.textContent = 'No points this round'
            endRoundModal.classList.add('lose')
        }

        endRoundModal.classList.remove('hide')

        // Remove the player list childs
        const playerList = document.getElementById('player-list')
        while (playerList.firstChild) playerList.removeChild(playerList.firstChild)

        // Recreate the player list
        for(const data of currentGameState.result) {
            const playerItem = document.createElement('div')
            playerItem.classList.add('player-item')
            const playerName = document.createElement('p')
            playerName.classList.add('name')
            playerName.textContent = `Player ${data.id}`
            const playerPoints = document.createElement('p')
            playerPoints.classList.add('points')
            playerPoints.textContent = `${data.points} point`
            
            playerItem.appendChild(playerName)
            playerItem.appendChild(playerPoints)
            playerList.appendChild(playerItem)
        }

        setTimeout(restartGame, 3000)
    }

    game = currentGameState
}

function restartGame() {
    endRoundModal.classList.add('hide')
    endRoundModal.classList.remove('win')
    endRoundModal.classList.remove('lose')

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
    
    fetch('/api/game/option', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ option, game: game.id, player: player.id })
    })
    .then(res => res.json())
    .then(updateGameState)
}

window.addEventListener("beforeunload", function (event) {
    fetch('/api/game/leave', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ game: game.id, player: player.id })
    })
})