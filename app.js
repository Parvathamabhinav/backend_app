const express = require('express');
const path=require('path');
const app = express();
const port = 3000;  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
const userModel = require('./models/user');
// Sample route
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/read', async (req, res) => {
  let allUsers = await userModel.find({});
  res.render('read', { users: allUsers });
});


app.post('/create', async (req, res) => {
  let {name, email, image} = req.body;
  try {
    await userModel.create({ name, email, image });
    res.redirect('/read');
  } catch (error) {
    res.status(500).send('Error creating user: ' + error.message);
  }
});

app.get('/delete/:id', async (req, res) => {
  let userId = req.params.id;
  try {
    await userModel.findByIdAndDelete(userId);
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
    await userModel.findByIdAndUpdate(id, { name, email, image });
    res.redirect('/read');
  } catch (error) {
    res.status(500).send('Error updating user: ' + error.message);
  }});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});