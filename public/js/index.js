let pvpModal = null
window.onload = () => {
    pvpModal = document.getElementById('pvp-modal')
    pvpModal.children[0].addEventListener('click', (e) => {
        e.stopPropagation()
        return false
    })
}

function onChangeGameId() {
    const idInput = document.getElementById("game-id-input")
    if(idInput.value.length === 0) return alert('Please, insert an ID!')
    const idLink = document.getElementById("game-id-link")
    idLink.setAttribute('href', `/game?game=${idInput.value}`)
}

function openModal() {
    pvpModal.classList.remove('hide')
}

function closeModal() {
    pvpModal.classList.add('hide')
}