const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

router.get('/', (req, res) => {
    User.findAll({
        attributes: ['id', 'username'],
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'content']
            }
        ]
    })
    .then(dbUser => res.json(dbUser))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'username'],
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'content']
            }
        ]
    })
    .then(dbUser => res.json(dbUser))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(dbUser => res.json(dbUser))
    .catch(err => {
        console.log(err);
        res.status(404).json(err);

    })
});

router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUser => {
        if(!dbUser[0]) {
            res.status(404).json({message: 'No user found!'});
            return;
        }
        res.json(dbUser);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUser => {
        if(!dbUser) {
            res.status(404).json({ message: 'No user found!'});
            return;
        }
        res.json(dbUser);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

module.exports = router;