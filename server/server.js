import "dotenv/config"
import express from 'express'
import {turso} from './db.js'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser"

const server = express()
server.use(cors({
    origin: 'http://localhost:3000',  // <-- frontend origin
    credentials: true
}                 // <-- allow cookies, auth headers
))
server.use(express.json())
server.use(cookieParser())

server.get("/checkauth", async (req, res) => {
    const token = req.cookies.token

    if (!token) {
        res.status(401).send({message: "Cant auth, please login"})
    }
    res.send({message: "You are deep inside!"})
})

server.get("/", async (req, res) => {
    const token = req.cookies.token

    if (!token) {
        res.status(401).send({message: "Cant auth, please login"})
    }

    try {
        jwt.decode(token, process.env.SECRET_KEY)
        const {rows} = await turso.execute(
            "SELECT * FROM tracker"
        );
        res.send({data: rows})
    } catch (e) {
        res.status(401).send({message: e.message})
    }
})

server.post("/create", async (req, res) => {
    const data = req.body
    //___________________ Sanitize data
    try {
        const query = await turso.execute(
            `INSERT INTO tracker (task, start_time) VALUES ('${data.task}', '${data.start_time}');`
        );
        if (query.rowsAffected == 1) {
            res.status(200).send({message: "Task created Succesfully!", id: Number(query.lastInsertRowid)})
        } else {
            throw new Error("Failed to create a task!")
        }

    } catch (e) {
        res.status(401).send({message: e.message})
    }
})

server.put("/stop", async (req, res) => {
    const data = req.body
    //___________________ Sanitize data
    try {
        const query = await turso.execute(`UPDATE tracker SET end_time='${data.end_time}' WHERE id='${data.id}';`)
        console.log(query)
        if (query.rowsAffected == 1) {
            res.status(200).send({message: "Task saved Succesfully!", id: Number(query.lastInsertRowid)})
        } else {
            throw new Error("Failed to save a task!")
        }
    } catch (e) {
        res.status(401).send({message: e.message})
    }
})

server.delete("/delete", async (req, res) => {
    const data = req.body

    try {
        const query = await turso.execute(`DELETE FROM tracker WHERE id='${data.id}';`)
        if (query.rowsAffected == 1) {
            res.status(200).send({message: "Task deleted Succesfully!"})
        } else {
            throw new Error("Failed to delete task")
        }

    } catch (e) {
        res.status(401).send({message: e.message})
    }
})

server.post("/register", async (req, res) => {
    const data = req.body

    if (!emailExist(data.email)) {
        res.status(401).send({message: "You Already have an account please login!"})
    }

    const hashed_pass = await hashPassword(data.password)
    if (!hashed_pass) {
        res.status(401).send({message: "Failed to hash password"})
    }

    try {
        const query = await turso.execute(`INSERT INTO users (name, email, password) VALUES ('${data.name}', '${data.email}', '${hashed_pass}');`)

        if (query.rowsAffected == 1) {
            const token = generateToken({id: Number(query.lastInsertRowid), email: data.email})
            res.cookie('token', token, {
                httpOnly: true,
                secure: false /*process.env.NODE_ENV === 'production'*/, // Use secure in production
                maxAge: 3600000, // 1 hour
                sameSite: 'strict'
            }).send({message: "User is deep Inside"});

        } else {
            throw new Error("Failed to insert user")
        }
    } catch (e) {
        res.status(401).send({message: e.message})
    }
})

server.post("/login", async (req, res) => {
    const data = req.body

    if (!emailExist(data.email)) {
        res.status(401).send({message: "You dont have an account please register!"})
    }

    try {
        const query = await turso.execute(`SELECT * FROM users WHERE email='${data.email}';`)

        const db_data = query.rows[0]
        const hashed_pass = await unhashPassword(data.password, db_data.password)

        if (!hashed_pass) {
            throw new Error("Password is wrong")
        }

        const token = generateToken({id: db_data.id, email: db_data.email})
        res.cookie('token', token, {
            httpOnly: true,
            secure: false /*process.env.NODE_ENV === 'production'*/, // Use secure in production
            maxAge: 3600000, // 1 hour
            sameSite: 'strict'
        }).send({message: "User is deep Inside"});

    } catch (e) {
        res.status(401).send({message: e.message})
    }
})

server.get('/logout', (req, res) => {
    res.clearCookie("token").send({message: "Logged out"})
})

async function emailExist(email) {
    const query = await turso.execute(`SELECT email FROM users WHERE email='${email}'`)
    if (query.rows > 0) {
        return true
    } else {
        return false
    }
}

async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(password, salt)
        return hash
    } catch (e) {
        return false
    }
}

async function unhashPassword(password, db_password) {
    try {
        const good_password = await bcrypt.compare(password, db_password)
        return good_password
    } catch (e) {
        return false

    }
}

function generateToken(user) {
    return jwt.sign({id: user.id, email: user.email}, process.env.SECRET_KEY, {expiresIn: '1h'});
}


server.listen(3001, () => console.log(`Server running... `))
