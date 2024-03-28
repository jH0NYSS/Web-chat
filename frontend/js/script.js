// login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

// chat elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

// menu elements
const menuButton =  chatForm.querySelector(".button")
const menu = document.querySelector(".menu")
const menu_fire = document.querySelector(".menu_buttons")


const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id: "", name: "", color: "" }

let websocket

effect = "none"

const createMessageSelfElement = (content) => {
    const div = document.createElement("div")

    switch(effect) {
        case "flame" :

            div.classList.add("flame")
            effect = "none"
          break;

        default:

            div.classList.add("message--self")
    }

    
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--other")

    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data)

    var msg = content



    const message =
        userId == user.id
            ? createMessageSelfElement(msg)
            : createMessageOtherElement(msg, userName, userColor)

    chatMessages.appendChild(message)

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage
}

const sendMessage = (event) => {
    event.preventDefault()
    chatInput.value = chatInput.value.trim()
    if (chatInput.value == ""){

    }else{

       

        const message = {
            userId: user.id,
            userName: user.name,
            userColor: user.color,
            content: chatInput.value
        }

        websocket.send(JSON.stringify(message))

        chatInput.value = ""

    }
}

const openMenu = (event) => {
    event.preventDefault()
    if (menu.style.display == "none"){

        menu.style.display = "flex"

    }else{
        menu.style.display = "none"
    }
       
}

const fire_messagem = (event) => {
    event.preventDefault()
    effect = "flame"

    addEventListener("click", sendMessage)
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)
menuButton.addEventListener("click", openMenu)
menu_fire.addEventListener("click", fire_messagem)

