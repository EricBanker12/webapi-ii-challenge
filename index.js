const express = require('express')

const postsRouter = require('./posts/posts-router')

const server = express()

const port = 5000

server.use(express.json())
server.use('/api/posts', postsRouter)

server.listen(port, () => {
    console.log(`=== listening on port ${port} ===`)
})