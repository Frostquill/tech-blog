const router = require('express').Router();
const {Post, User, Comment} = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [
            {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
        console.log(dbPost);
        const posts = dbPost.map(post => post.get({plain: true }));
        console.log(posts);
        res.render('dashboard', {posts, loggedIn: true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


router.get('/edit/:id', (req, res) => {
    Post.findByPk(req.params.id, {
        attributes: ['id', 'title', 'content', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }, 
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPost => {
        if(dbPost) {
            const post = dbPost.get({ plain: true });

            res.render('edit-post', {
                post,
                loggedIn: true
            });
        } else {
            res.status(404).end();
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
});


module.exports = router;