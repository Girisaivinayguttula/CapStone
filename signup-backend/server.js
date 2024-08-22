const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Atlas Connection
const mongoURI = 'mongodb+srv://Veenaee:Vinay%401505@pro.9gpov.mongodb.net/myDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB Atlas:', err));

// Define the User model
const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    email: String,
    password: String,
}));

// API route to handle signup
app.post('/api/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error('Error saving user:', error); // Log the error
        res.status(400).send({ error: 'Error saving user', details: error.message });
    }
});


app.listen(port, () => console.log(`Server running on port ${port}`));
