const router = require('express').Router()

const db = require('../data/db')

// POST create a new blog post
router.post('/', (req, res) => {
    const {title, contents} = req.body
    
    if (!title || !contents || typeof title != 'string' || typeof contents != 'string') {
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    }
    else {
        const date = new Date()
        const post = {title, contents, created_at: date, updated_at: date}

        db.insert(post)
        .then(resp => {
            // console.log(resp)
            res.json({...post, ...resp})
        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({error: "There was an error while saving the post to the database."})
        })
    }
})

module.exports = router