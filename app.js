const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
require('dotenv').config({ quiet: true });

const userModel = require('./models/user');
const peopleModel = require('./models/people');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.set('view engine', 'ejs');


// =======================
// ROUTES
// =======================

// REGISTER PAGE
app.get('/', (req, res) => {
  res.render('register', { query: req.query });
});


// REGISTER USER
app.post('/register', async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.redirect('/?error=Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await userModel.create({
      name,
      email,
      password: hash
    });

    res.redirect('/login?success=Account created successfully');

  } catch (err) {
    res.redirect('/?error=Something went wrong');
  }
});


// LOGIN PAGE
app.get('/login', (req, res) => {
  res.render('login', { query: req.query });
});


// LOGIN USER
app.post('/login', async (req, res) => {
  try {
    let { name, password } = req.body;

    const user = await userModel.findOne({ name });
    if (!user) {
      return res.redirect('/login?error=Invalid username or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect('/login?error=Invalid username or password');
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_KEY,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/index');

  } catch (err) {
    res.redirect('/login?error=Login failed');
  }
});


// INDEX PAGE
app.get('/index', (req, res) => {
  res.render('index');
});


// READ PEOPLE
app.get('/read', async (req, res) => {
  const allPeople = await peopleModel.find({});
  res.render('read', { people: allPeople });
});


// CREATE PERSON
app.post('/create', async (req, res) => {
  try {
    const { name, occupation, image } = req.body;
    await peopleModel.create({ name, occupation, image });
    res.redirect('/read?success=Person added');
  } catch (err) {
    res.redirect('/index?error=Failed to create person');
  }
});


// DELETE PERSON
app.get('/delete/:id', async (req, res) => {
  try {
    await peopleModel.findByIdAndDelete(req.params.id);
    res.redirect('/read?success=Person deleted');
  } catch (err) {
    res.redirect('/read?error=Delete failed');
  }
});


// EDIT PAGE
app.get('/edit/:id', (req, res) => {
  res.render('edit', { userId: req.params.id, query: req.query });
});


// UPDATE PERSON
app.post('/edit', async (req, res) => {
  try {
    const { id, name, occupation, image } = req.body;

    await peopleModel.findByIdAndUpdate(id, {
      name,
      occupation,
      image
    });

    res.redirect('/read?success=User updated successfully');

  } catch (err) {
    res.redirect('/read?error=Update failed');
  }
});


// SERVER
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
