const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const leadRoutes = require('./routes/leadRoutes');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/lead', leadRoutes);

const users = [
    { id: 1, username: 'admin', password: '$2a$10$KvJ/2FlnQpe.QGHFq0NVce.WsRljGpGVtKlXFPHgXhXUwb6.cACQO', role: 'admin' }, // Hashed password for '123456'
    { id: 2, username: 'user', password: '$2a$10$KvJ/2FlnQpe.QGHFq0NVce.WsRljGpGVtKlXFPHgXhXUwb6.cACQO', role: 'user' }   // Hashed password for '123456'
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err || !isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    });
});

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Access denied' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    });
};

app.get('/dashboard', authenticateJWT, (req, res) => {
    const role = req.user.role;
    if (role === 'admin') {
        res.json({ message: 'Welcome Admin!' });
    } else {
        res.status(403).json({ message: 'Access denied for non-admin users' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
