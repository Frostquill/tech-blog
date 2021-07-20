const router = require('express').Router();
const {Comment} = require('../../models');


router.get('/', (req, res) => {
    Comment.findAll()
    .then(dbComment => res.json(dbComment))
    .catch (err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// router.post('/', (req, res) => {

// });

// router.delete('/:id', (req, res) => {

// });

module.exports = router