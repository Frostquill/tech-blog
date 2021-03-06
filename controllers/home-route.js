const router = require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');


router.get('/', (req, res) => {
  Post.findAll({
      attributes: [
          'id',
          'title',
          'content',
          'created_at'
      ],
      include: [
          {
          model:Comment,
          attributes: ['id','comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
              model:User,
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
      const posts = dbPost.map(post => post.get({ plain: true }));

      res.render('homepage', {
          posts,
          loggedIn: req.session.loggedIn
      });
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
});

router.get('/login', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
})

router.get('/post/:id', (req,res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'content', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'user_id', 'post_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model:User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPost => {
        if(!dbPost) {
            res.status(404).json({ message: 'No post found!'});
            return;
        }

        const post = dbPost.get({ plain: true });

        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})


module.exports = router;