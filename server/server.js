import "dotenv/config"
import express from 'express'
import {turso} from './db.js'

const _PORT = 3001
const server = express()


async function getTasks() {
    const data = await turso.execute(
        "SELECT * FROM tracker"
    );

    const rows = data.rows
    console.log(rows)

    return rows
}
getTasks()



server.listen(_PORT, () => console.log(`Server running at port ${_PORT}`))
