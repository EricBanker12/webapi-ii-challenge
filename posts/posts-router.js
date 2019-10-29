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
            res.status(201).json({...post, ...resp})
        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({error: "There was an error while saving the post to the database."})
        })
    }
})

// POST create a new comment
router.post('/:id/comments', (req, res) => {
    const post_id = req.params.id
    const text = req.body.text
    
    if (!text || typeof text != 'string') {
        res.status(400).json({errorMessage: "Please provide text for the comment."})
    }
    else {
        const date = new Date()
        const comment = {text, post_id, created_at: date, updated_at: date}

        db.insertComment(comment)
        .then(resp => {
            // console.log(resp)
            res.status(201).json({...comment, ...resp})
        })
        .catch(err => {
            // console.log(err, Object.keys(err))
            if (err.errno === 19) res.status(404).json({message: "The post with the specified ID does not exist."})
            else res.status(500).json({error: "There was an error while saving the comment to the database."})
        })
    }
})

module.exports = router