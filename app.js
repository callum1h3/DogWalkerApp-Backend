const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const http = require('http');

// Makes it so we can change these settings when the project is containized.
const MONGO_URL = process.env.MONGO_URL || 'mongodb+srv://callum1h1:eP1TLNS5QrSPMsIL@cluster0.eywkujf.mongodb.net/';
const SECRET_KEY = process.env.SECRET_KEY || 'sbjbdfhsf2!!1kjjaj1!A';
const WEB_PORT = process.env.WEB_PORT || 3005;
const mongoose = require('mongoose');

// Connect to the database.
mongoose.connect(MONGO_URL);

// This defines the user in the database so we can include it later in the main part of the login system.
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function FindUserByName(username)
{
    const user = await User.findOne({ username });
    return user;
}
 
app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET");
    res.setHeader("Access-Control-Allow-Headers", "*");

    next();
});

// Basic registration and login code.
app.post('/register/', async (req, res) => {
    try {
        // Gets the login credentals from post request.
        const { username, password } = req.body;

        // Checks if that username already exists
        const user_check = await FindUserByName(username);
        if (user_check)
        {
            return res.status(500).json({ error: 'User already exists' });
        }

        // Turns the password into a hashed password for security.
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creates a new user in the database.
        const user = new User({ username, password: hashedPassword });
        await user.save();

        console.log(username + " has successfully registered!");

        return res.status(200).json({ message: 'User registered successfully' });
    } 
    catch (error) {
        return res.status(500).json({ error: 'Registration failed' });
    }
})

// This will output the login token if you successfully send the right username and password.
app.post('/login/', async (req, res) => {
    try {

        const { username, password } = req.body;
        const user = await FindUserByName(username);
        if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
        return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id, username: username }, SECRET_KEY, {
        expiresIn: '1h',
        });

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ error: 'Login failed' });
    }
})

app.post('/verify/', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token)
        { 
            console.log("Token not valid!");
            return res.status(401).json({ error: 'Access denied' });
        }
        const decoded = jwt.verify(token, SECRET_KEY);

        return res.status(200).json({decoded});
    }
    catch (error) 
    {
        return res.status(401).json({ error: 'Invalid token' });
    }
})

const httpServer = http.createServer(app);
httpServer.listen(3005, () => console.log("server is running!"))




