const express = require('express');
const router = require('express').Router();

/* GET home page */
router.get('/', (req, res, next) => {
  const currentUser = req.session.currentUser;
  res.render('index', { currentUser });
});

const authMiddleware = require('../middleware/authMiddleware');

router.get('/main', authMiddleware, (req, res) => {
  res.render('main');
});

router.get('/private', authMiddleware, (req, res) => {
  res.render('private');
});

module.exports = router;
