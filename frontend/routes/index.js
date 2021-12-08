import express from 'express';
import cors from 'cors';
import { requiresAuth } from 'express-openid-connect';
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Find(me)',
    isAuthenticated: req.isAuthenticated(),
    user: req.openid.user,
  });
});

router.get('/logout', requiresAuth(), function (req, res, next) {
  res.render('index', {
    title: 'Find(me)',
    isAuthenticated: req.isAuthenticated(),
    user: req.openid.user,
  });
});

router.get('/userinfo', requiresAuth(), cors(), function (req, res, next) {
  res.send(req.openid.user);
});

module.exports = router;
