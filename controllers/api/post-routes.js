const router = require('express').Router();
const { Post, User, Comment } = require('../../models');



router.get('/', (req, res) => {
    Post.findAll ({
        attributes: ['id', 'title', 'content'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPost => res.json(dbPost))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'content'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
        })
        .then(dbPost => {
            if(!dbPost) {
                res.status(404).json({ message: 'No posts found!'});
                return;
            }
            res.json(dbPost);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    })
    .then(dbPost => res.json(dbPost))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title,
            content: req.body.content
        },
        {
        where: {
            id: req.params.id
        }
        })
    .then(dbPost => {
        if(!dbPost) {
            res.status(404).json({ message: 'Post not found!'})
            return;
        }
        res.json(dbPost);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);

    })
});

router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPost => {
        if(!dbPost) {
            res.status(404).json({message: 'Post not found!'});
            return;
        }
        res.json({ message: 'Post deleted!' });
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    })
});

module.exports = router;