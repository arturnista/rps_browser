window.onload = () => {
    const winModal = document.getElementById("win-modal")
    const loseModal = document.getElementById("lose-modal")

    let game = window.location.search.match(/[\?\&]game=[^\?^\&]*/g)
    if(game) game = game[0].replace('?game=', '')

    if(game) {
        console.log('ENTER!')
    } else {
        console.log('CREATE!')
    }

    window.selectOption = (option) => {
        fetch('/option', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ option, game })
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
        })
        winModal.style.display = 'inherit'
    }
}