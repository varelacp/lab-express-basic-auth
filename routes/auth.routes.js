const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup', { errorMessage: 'Fill in all the fields' });
    return;
  }

  const user = await User.findOne({ username });
  if (user !== null) {
    res.render('auth/signup', { errorMessage: 'Username already exists' });
    return;
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  await User.create({
    username,
    password: hashedPassword
  });
  res.redirect('/');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/login', { errorMessage: 'invalid login' });
    return;
  }

  const user = await User.findOne({ username });
  if (!user) {
    res.render('auth/login', { errorMessage: 'invalid login' });
    return;
  }

  //Check for password
  if (bcrypt.compareSync(password, user.password)) {
    //Passwords match
    req.session.currentUser = user;
    console.log(req.session.currentUser);
    res.redirect('/main');
  } else {
    //Passwords don't match
    res.render('auth/login', { errorMessage: 'invalid login' });
    return;
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.get('/main', authMiddleware, (req, res) => {
  res.render('main');
});

router.post('/main', (req, res) => {
  const { data } = req.body;
  res.redirect('/main');
});

router.get('/private', authMiddleware, (req, res) => {
  res.render('private');
});

router.post('/private', (req, res) => {
  const { data } = req.body;
  res.redirect('/private');
});

module.exports = router;
