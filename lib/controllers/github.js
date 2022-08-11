const { Router } = require('express');
const { exchangeCodeForToken } = require('../services/github');

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
      res.json({ token });
    } catch (e) {
      next(e);
    }
  });

//   b84e9448141fdb151d59
