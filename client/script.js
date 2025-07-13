const form = document.getElementById("form")
const display = document.getElementById("show")
const button = document.getElementById("button")

let running = false
let main_interval
let current_id

async function getData() {
    const res = await fetch("http://localhost:3001/", {method: "GET"})
    if (res.ok) {
        const body = await res.json()
        const items = body.data.reverse()
        data_container.innerHTML = ''
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
            current_id = done.id
            UpdateTime(start_time, name)
        } else {
            console.log("Failed")
        }
    } else {
        stopTimer()
    }
}

async function deleteTask(id, element_id) {
    const data = {id}

    const res = await fetch("http://localhost:3001/delete", {method: "DELETE", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)})

    if (res.ok) {
        console.log("done")
        document.getElementById(element_id).remove()
    } else {
        console.error("cant delete")
    }
}

function UpdateTime(start_time) {
    running = true
    button.innerText = "Stop"
    main_interval = setInterval(() => {
        const lap = Math.floor((Date.now() - start_time) / 1000)
        display.innerText = lap
        document.title = `Tracker - ${lap}`
    }, 1000)

}

function stopTimer() {
    stopTask(current_id)
    task_input.disabled = false
    running = false
    button.innerText = "Start"
    display.innerText = "00:00:00"
    document.title = `Tracker`
    form.reset()
    clearInterval(main_interval)
}

async function stopTask(id) {
    const data = {end_time: Date.now(), id}

    const res = await fetch(`http://localhost:3001/stop`, {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)})

    if (res.ok) {
        console.log("task log saved")
    } else {
        console.error("task log saved")
    }
    getData();
}



function createTaskElement(data) {
    const element_id = Math.random()

    const date_start = new Date(Number(data.start_time))
    const date_end = new Date(Number(data.end_time))

    const duration = Number(data.end_time) - Number(data.start_time)
    let dd = new Date(duration)
    let hrs = dd.getUTCHours()
    let mts = dd.getUTCMinutes()
    let secs = dd.getUTCSeconds()

    const display_duration = `${hrs}:${mts}:${secs}`


    const task = document.createElement('div')
    task.id = element_id

    const task_details = document.createElement('div')
    const task_title = document.createElement('div')
    const task_time = document.createElement('div')
    const task_options = document.createElement('div')

    const title = document.createElement('h3')
    const project = document.createElement('p')
    const tag = document.createElement('p')
    const start = document.createElement('p')
    const end = document.createElement('p')
    const show_duration = document.createElement('p')
    const continue_btn = document.createElement('button')
    const delete_btn = document.createElement('button')


    title.innerText = data.task;
    project.innerText = data.project
    tag.innerText = data.tag
    start.innerText = date_start.toLocaleString()
    end.innerText = date_end.toLocaleString()
    show_duration.innerText = display_duration
    continue_btn.innerText = 'Cont'
    delete_btn.innerText = "Del"

    task_title.appendChild(title)
    task_title.appendChild(project)

    task_details.appendChild(tag)

    task_time.appendChild(start)
    task_time.appendChild(end)

    task_options.appendChild(show_duration)
    // task_options.appendChild(continue_btn)
    task_options.appendChild(delete_btn)

    task_details.appendChild(task_time)
    task_details.appendChild(task_options)

    task.appendChild(task_title)
    task.appendChild(task_details)


    task.className = 'task'
    task_time.className = 'task__time'
    task_details.className = 'task__details'
    task_options.className = 'task__options'
    task_title.className = 'task__title'

    delete_btn.addEventListener('click', () => deleteTask(data.id, element_id))

    return task
}
