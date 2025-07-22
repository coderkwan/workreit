
async function checkAuth() {
    const res = await fetch("http://localhost:3001/loggedin", {method: "GET", credentials: "include"})

    if (res.ok) {
        window.location.replace("/")
    } else {
        content.style.display = 'block'
    }
}

checkAuth()

if (document.getElementById('register_form')) {
    register_form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const name = e.target.name.value
        const email = e.target.email.value;
        const password = e.target.password.value

        const data = {name, email, password}

        const res = await fetch("http://localhost:3001/register", {method: "POST", credentials: "include", body: JSON.stringify(data), headers: {"Content-Type": "application/json"}})

        let ans = await res.json()
        if (res.ok) {
            console.log(ans.message)
            console.log("registered")
            window.location.replace("/")

        } else {
            console.log(ans.message)
            console.log("not registered")
        }
    })
}

if (document.getElementById('login_form')) {
    login_form.addEventListener("submit", async (e) => {
        e.preventDefault()
        const email = e.target.email.value;
        const password = e.target.password.value

        const data = {email, password}

        const res = await fetch("http://localhost:3001/login", {method: "POST", credentials: "include", body: JSON.stringify(data), headers: {"Content-Type": "application/json"}})

        let ans = await res.json()
        if (res.ok) {
            console.log(ans.message)
            console.log("logged in")
            window.location.replace("/")
        } else {
            console.log(ans.message)
            console.log("not logged in")
        }
    })
}
