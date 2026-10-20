function updateClock() {
    const now = new Date()

    const year = now.getFullYear()
    const month = now.toLocaleString('default', { month: 'long' })
    const day = String(now.getDate()).padStart(2, '0')

    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    const format1 = `${month} ${day}, ${year}`
    const format2 = `${hours}:${minutes}:${seconds}`

    const dayOfYear = document.getElementById("date")
    const timeOfDay = document.getElementById("time")

    dayOfYear.textContent = format1
    timeOfDay.textContent = format2
}
updateClock()
setInterval(updateClock, 1000)

const display = document.getElementById("display")
const startBtn = document.getElementById("start")
const resetBtn = document.getElementById("reset")
const lapBtn = document.getElementById("lap")
const clearBtn = document.getElementById("clear")
const lapsDisplay = document.querySelector(".laptimesdisplay")
const firstDisplay = document.querySelector(".laptimes")
const labelDisplay = document.querySelector(".laptimeslabel")
const theme = document.getElementById("theme")

let running = false
let elapsed = 0
let startTime = 0
let timerID = null
let lapCount = 0
let themeStatus = false
let img = document.createElement("img")
img.src = "icon-start.png"

function formatTime(milliseconds) {
    const totalHundreths = Math.floor(milliseconds / 10)
    const hundreths = totalHundreths % 100
    const totalSeconds = Math.floor(milliseconds / 1000)
    const seconds = totalSeconds % 60
    const totalMinutes = Math.floor(totalSeconds / 60)
    const minutes = totalMinutes % 60
    const hours = Math.floor(totalMinutes / 60)

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundreths).padStart(2, '0')}`
}

function render() {
    display.textContent = formatTime(elapsed)
}

function tick() {
    elapsed = performance.now() - startTime
    render()
}

function start() {
    if (running) {
        running = false
        cancelAnimationFrame(timerID)
        startBtn.textContent = ""
        startBtn.appendChild(img)
        startBtn.appendChild(document.createTextNode("Resume"))
        return
    }

    running = true
    startTime = performance.now() - elapsed
    startBtn.textContent = "|| Pause"

    function frame() {
        if (!running) {
            return
        }
        tick()
        timerID = requestAnimationFrame(frame)
    }

    timerID = requestAnimationFrame(frame)
}

function reset() {
    running = false
    cancelAnimationFrame(timerID)
    elapsed = 0
    lapCount = 0
    startBtn.textContent = ""
    startBtn.appendChild(img)
    startBtn.appendChild(document.createTextNode("Start"))
    lapsDisplay.innerHTML = ""

    if (firstDisplay) {
        lapsDisplay.appendChild(labelDisplay)
        lapsDisplay.appendChild(firstDisplay)
    }

    render()
}

function addLap() {
    if (!running) {
        return
    }

    lapCount++

    if (lapCount === 1 && firstDisplay && lapsDisplay.contains(firstDisplay)) {
        lapsDisplay.removeChild(firstDisplay)
    }

    const item1 = document.createElement("p")
    const item2 = document.createElement("span")
    const item3 = document.createElement("div")

    item3.className = "laptimes"

    item1.style.fontSize = "16px"
    item2.style.fontSize = "16px"

    item1.textContent = `Lap ${lapCount}`
    item2.textContent = `${formatTime(elapsed)}`

    item3.append(item1, item2)
    item3.style.display = "flex"
    item3.style.justifyContent = "space-between"

    lapsDisplay.appendChild(item3)
}

startBtn.addEventListener('click', () => {
    start()
})

resetBtn.addEventListener('click', () => {
    reset()
})

lapBtn.addEventListener('click', () => {
    addLap()
})

clearBtn.addEventListener('click', () => {
    lapCount = 0
    lapsDisplay.innerHTML = ""
    lapsDisplay.appendChild(labelDisplay)
    lapsDisplay.appendChild(firstDisplay)
})

theme.addEventListener('click', () => {
    if (themeStatus === false) {
        document.body.classList.add('dark')
        theme.src = 'icon-sun.svg'
        themeStatus = true
    } else {
        document.body.classList.remove('dark')
        theme.src = 'icon-moon.png'
        themeStatus = false
    }
})

render()