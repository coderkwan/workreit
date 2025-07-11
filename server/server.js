import "dotenv/config"
import express from 'express'
import {turso} from './db.js'
import cors from 'cors'

const _PORT = 3001
const server = express()
server.use(cors())
server.use(express.json())


async function getTasks() {
    const data = await turso.execute(
        "SELECT * FROM tracker"
    );

    const rows = data.rows
    return rows
}

server.get("/", async (req, res) => {
    const data = await getTasks()
    res.send({data})
})

server.post("/create", async (req, res) => {
    const data = req.body

    try {
        const query = await turso.execute(
            `INSERT INTO tracker (task, start_time) VALUES ('${data.task}', '${data.start_time}');`
        );
        console.log(query)
        if (query.rowsAffected == 1) {

            res.status(200).send({message: "Task created Succesfully!", id: Number(query.lastInsertRowid)})
        } else {
            throw new Error("Failed to create a task!")
        }

    } catch (e) {
        res.status(401).send({message: e.message})
    }
})


server.listen(_PORT, () => console.log(`Server running at port ${_PORT}`))
