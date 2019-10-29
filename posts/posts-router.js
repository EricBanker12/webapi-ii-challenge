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

// GET array of all posts
router.get('/', (req, res) => {
    db.find()
    .then(resp => {
        // console.log(resp)
        res.json(resp)
    })
    .catch(err => {
        // console.log(err)
        res.status(500).json({error: "The posts information could not be retrieved."})
    })
})

// GET specified post by id
router.get('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(resp => {
        // console.log(resp)
        const post = resp[0]
        if (post) res.json(post)
        else res.status(404).json({message: "The post with the specified ID does not exist."})
    })
    .catch(err => {
        // console.log(err)
        res.status(500).json({error: "The post information could not be retrieved."})
    })
})

// GET array of comments by post id
router.get('/:id/comments', async (req, res) => {
    // check if the post exists
    const post = await db.findById(req.params.id)
    .then(resp => {
        // console.log(resp)
        return resp[0]
    })
    .catch(err => {
        // console.log(err)
        res.status(500).json({error: "The comments information could not be retrieved."})
    })

    // cancel and error if post does not exist
    if (!post) {
        res.status(404).json({message: "The post with the specified ID does not exist."})
        return
    }

    // get comments
    db.findPostComments(req.params.id)
    .then(resp => {
        // console.log(resp)
        res.json(resp)
    })
    .catch(err => {
        // console.log(err)
        res.status(500).json({error: "The comments information could not be retrieved."})
    })
})

module.exports = router