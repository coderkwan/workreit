const form = document.getElementById("form")
const display = document.getElementById("show")
const button = document.getElementById("button")

let running = false
let main_interval

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const name = e.target.task.value
    const start_time = Date.now()

    if (!running) {
        UpdateTime(start_time, name)
    } else {
        stopTimer()
    }
})

function UpdateTime(start_time) {
    running = true
    button.innerText = "Stop"
    main_interval = setInterval(() => {
        display.innerText = Math.floor((Date.now() - start_time) / 1000)
    }, 1000)

}

function stopTimer() {
    running = false
    button.innerText = "Start"
    display.innerText = "00:00:00"
    form.reset()
    clearInterval(main_interval)
}
