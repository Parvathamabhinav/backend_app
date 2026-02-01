const express = require('express');
const path=require('path');
const app = express();
const port = 3000;  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
const userModel = require('./models/user');
const peopleModel = require('./models/people');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
require('dotenv').config({quiet: true});
app.use(cookieParser());


app.get('/', (req, res) => {
  res.render('register');
});


app.post('/register', async (req, res) => {
  let {name, email,password} = req.body;

  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, async function(err, hash) {
        password=hash;
        try {
          let user = await userModel.create({ name, email, password });
          res.redirect('/login');
        } catch (error) {
          res.status(500).send('Error registering user: ' + error.message);
        }
    });
  });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  let {name , password} = req.body;
  try {
    let user = await userModel.findOne({ name });
    if (!user) {
      return res.status(400).send('Invalid name or password');
    }
    bcrypt.compare(password, user.password, function(err, result) {
      if (result) {
        let token=jwt.sign({userId:user._id}, process.env.JWT_KEY,{expiresIn:'1d'});
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/index');
      } else {
        res.status(400).send('Invalid name or password');
      }
    });
  } catch (error) {
    res.status(500).send('Error logging in: ' + error.message);
  }
});

app.get('/index', (req, res) => {
  res.render('index');
});

app.get('/read', async (req, res) => {
  let allPeople = await peopleModel.find({});
  res.render('read', { people: allPeople });
});


app.post('/create', async (req, res) => {
  let {name, occupation, image} = req.body;
  try {
    await peopleModel.create({ name, occupation, image });
    res.redirect('/read');
  } catch (error) {
    res.status(500).send('Error creating person: ' + error.message);
  }
});






app.get('/delete/:id', async (req, res) => {
  let userId = req.params.id;
  try {
    await peopleModel.findByIdAndDelete(userId);
    res.redirect('/read');
  }
  catch (error) {
    res.status(500).send('Error deleting user: ' + error.message);
  } 
});

app.get('/edit/:id', async (req, res) => {
  res.render('edit', { userId: req.params.id });
});

app.post('/edit', async (req, res) => {
  let { id, name, email, image } = req.body;  
  try {
    await peopleModel.findByIdAndUpdate(id, { name, email, image });
    res.redirect('/read');
  } catch (error) {
    res.status(500).send('Error updating user: ' + error.message);
  }});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});