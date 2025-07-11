const form = document.getElementById("form")
const display = document.getElementById("show")
const button = document.getElementById("button")

let running = false
let main_interval

async function getData() {
    const res = await fetch("http://localhost:3001/", {method: "GET"})
    if (res.ok) {
        const body = await res.json()
        const items = body.data.reverse()
        items.forEach((item, index) => {
            data_container.appendChild(createTaskElement(item))
        })
    } else {
        console.log("cant find content")
    }
}
getData()

form.addEventListener("submit", (e) => createTask(e))


async function createTask(e) {
    e.preventDefault()
    task_input.disabled = true

    const name = e.target.task.value
    const start_time = Date.now()
    const data = {task: name, start_time, tag: "", project: ""}

    if (!running) {

        const res = await fetch("http://localhost:3001/create", {method: "POST", body: JSON.stringify(data), headers: {"Content-Type": "application/json"}})

        if (res.ok) {
            const done = await res.json()
            // Store and use ID
            UpdateTime(start_time, name)
        } else {
            console.log("Failed")
        }
    } else {
        stopTimer()
    }
}

function UpdateTime(start_time) {
    running = true
    button.innerText = "Stop"
    main_interval = setInterval(() => {
        display.innerText = Math.floor((Date.now() - start_time) / 1000)
    }, 1000)

}

function stopTimer() {
    task_input.disabled = false
    running = false
    button.innerText = "Start"
    display.innerText = "00:00:00"
    form.reset()
    clearInterval(main_interval)
}



function createTaskElement(data) {
    const task = document.createElement('div')
    const task_details = document.createElement('div')
    const task_title = document.createElement('div')
    const task_time = document.createElement('div')
    const task_options = document.createElement('div')

    const title = document.createElement('h3')
    const project = document.createElement('p')
    const tag = document.createElement('p')
    const start = document.createElement('p')
    const end = document.createElement('p')
    const continue_btn = document.createElement('button')
    const options_btn = document.createElement('button')

    title.innerText = data.task;
    project.innerText = data.project
    tag.innerText = data.tag
    start.innerText = data.start_time
    end.innerText = data.end_time
    continue_btn.innerText = 'Cont'
    options_btn.innerText = '...'

    task_title.appendChild(title)
    task_title.appendChild(project)

    task_details.appendChild(tag)

    task_time.appendChild(start)
    task_time.appendChild(end)

    task_options.appendChild(continue_btn)
    task_options.appendChild(options_btn)

    task_details.appendChild(task_time)
    task_details.appendChild(task_options)

    task.appendChild(task_title)
    task.appendChild(task_details)


    task.className = 'task'
    task_time.className = 'task__time'
    task_details.className = 'task__details'
    task_options.className = 'task__options'
    task_title.className = 'task__title'

    return task
}
