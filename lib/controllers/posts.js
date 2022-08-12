const { Router } = require('express');
const Post = require('../models/Post');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const data = await Post.getPosts();
      res.json(data);
    } catch (e) {
      next(e);
    }
  })
  .post('/', authenticate, async (req, res, next) => {
    try {
      const data = await Post.createNewPost(req.body);
      res.json(data);
    } catch (e) {
      next(e);
    }
  });
