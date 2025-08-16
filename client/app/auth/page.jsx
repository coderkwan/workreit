"use client"
import Login from "@/components/Login"
import Register from "@/components/Register"
import {useState} from "react"

export default function Page() {
    const [login, setLogin] = useState(true)
    return (
        <div>
            {login ? <Login setLogin={setLogin} login={login} /> : <Register setLogin={setLogin} login={login} />}
        </div>
    )
}
