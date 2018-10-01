function onChangeGameId() {
    const idInput = document.getElementById("game-id-input")
    if(idInput.value.length === 0) return alert('Please, insert an ID!')
    const idLink = document.getElementById("game-id-link")
    idLink.setAttribute('href', `/game?game=${idInput.value}`)
}