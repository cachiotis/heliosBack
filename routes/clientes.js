const express = require('express');
const router = express.Router();
const Client = require('../models/cliente');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { nombre, cedula, telefono, direccion, descripcionCaso } = req.body;

        const cliente = new Client({
            nombre,
            cedula,
            telefono,
            direccion,
            descripcionCaso,
            usuarioId: req.User.id
        });

        await cliente.save();

        res.json({ msg: 'Cliente agregado al proceso', cliente });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al guardar Cliente' });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const clientes = await Client.find({ usuarioId: req.User.id });
        res.json(clientes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al obtener Clientes' });
    }
});

module.exports = router;
