const { Router } = require('express');
const GithubUser = require('../models/GithubUser');
const jwt = require('jsonwebtoken');
const { exchangeCodeForToken, getGithubData } = require('../services/github');
const authenticate = require('../middleware/authenticate');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', async (req, res) => {
    // TODO: Kick-off the github oauth flow
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.GH_CLIENT_ID}&scope=user&redirect_uri=${process.env.GH_REDIRECT_URI}`
    );
  })
  .get('/callback', async (req, res, next) => {
    // const { code } = req.query;
    // res.json({ code });
    try {
      const { code } = req.query;

      const token = await exchangeCodeForToken(code);

      const githubData = await getGithubData(token);

      //   res.json({ githubData });
      let user = await GithubUser.findByUsername(githubData.login);

      if (!user) {
        user = await GithubUser.addUser({
          username: githubData.login,
          email: githubData.email,
          avatar: githubData.avatar_url,
        });
      }

      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .redirect('/api/v1/github/dashboard');
    } catch (e) {
      next(e);
    }
  })

  .get('/dashboard', authenticate, async (req, res) => {
    res.json(req.user);
  })

  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'You are logged out!' });
  });
