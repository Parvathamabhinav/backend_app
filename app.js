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
// GLOBAL MESSAGE MIDDLEWARE ✅
// =======================
// This ensures error & success ALWAYS exist in EJS
app.use((req, res, next) => {
  res.locals.error = null;
  res.locals.success = null;
  next();
});

// =======================
// ROUTES
// =======================

// REGISTER PAGE
app.get('/', (req, res) => {
  res.render('register');
});

// REGISTER USER
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.render('register', {
        error: 'Email already exists'
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await userModel.create({
      name,
      email,
      password: hash
    });

    res.render('login', {
      success: 'Account created successfully. Please login.'
    });

  } catch (err) {
    res.render('register', {
      error: 'Something went wrong. Try again.'
    });
  }
});

// LOGIN PAGE
app.get('/login', (req, res) => {
  res.render('login');
});

// LOGIN USER
app.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await userModel.findOne({ name });
    if (!user) {
      return res.render('login', {
        error: 'Invalid username or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', {
        error: 'Invalid username or password'
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_KEY,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/index');

  } catch (err) {
    res.render('login', {
      error: 'Login failed. Please try again.'
    });
  }
});

// INDEX PAGE
app.get('/index', (req, res) => {
  res.render('index');
});

// READ PEOPLE
app.get('/read', async (req, res) => {
  const people = await peopleModel.find({});
  res.render('read', { people });
});

// CREATE PERSON
app.post('/create', async (req, res) => {
  try {
    const { name, occupation, image } = req.body;

    await peopleModel.create({ name, occupation, image });

    const people = await peopleModel.find({});
    res.render('read', {
      people,
      success: 'Person added successfully'
    });

  } catch (err) {
    res.render('index', {
      error: 'Failed to create person'
    });
  }
});

// DELETE PERSON
app.get('/delete/:id', async (req, res) => {
  try {
    await peopleModel.findByIdAndDelete(req.params.id);

    const people = await peopleModel.find({});
    res.render('read', {
      people,
      success: 'Person deleted successfully'
    });

  } catch (err) {
    const people = await peopleModel.find({});
    res.render('read', {
      people,
      error: 'Delete failed'
    });
  }
});

// EDIT PAGE
app.get('/edit/:id', async (req, res) => {
  res.render('edit', { userId: req.params.id });
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

    const people = await peopleModel.find({});
    res.render('read', {
      people,
      success: 'User updated successfully'
    });

  } catch (err) {
    const people = await peopleModel.find({});
    res.render('read', {
      people,
      error: 'Update failed'
    });
  }
});

// SERVER
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
