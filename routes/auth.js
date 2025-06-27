const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password ) {
        return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar usuario' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    if (!username || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
