const express = require('express');
const router = express.Router();
const Client = require('../models/cliente');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { nombre, cedula, telefono, direccion, descripcionCaso, estado } = req.body;

        const cliente = new Client({
            nombre,
            cedula,
            telefono,
            direccion,
            descripcionCaso,
            estado,
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

router.put('/:id', auth, async (req, res) => {
    try {
        const { nombre, cedula, telefono, direccion, descripcionCaso, estado } = req.body;
        let cliente = await Client.findById(req.params.id);

        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        if (cliente.usuarioId.toString() !== req.User.id) {
            return res.status(401).json({ msg: 'No autorizado para actualizar este cliente' });
        }

        const camposActualizar = {};
        if (nombre !== undefined) camposActualizar.nombre = nombre;
        if (cedula !== undefined) camposActualizar.cedula = cedula;
        if (telefono !== undefined) camposActualizar.telefono = telefono;
        if (direccion !== undefined) camposActualizar.direccion = direccion;
        if (descripcionCaso !== undefined) camposActualizar.descripcionCaso = descripcionCaso;
        if (estado !== undefined) camposActualizar.estado = estado;

        if (Object.keys(camposActualizar).length === 0) {
            return res.status(400).json({ msg: 'No se proporcionaron campos para actualizar' });
        }

        cliente = await Client.findByIdAndUpdate(
            req.params.id,
            { $set: camposActualizar },
            { new: true }
        );

        res.json({ msg: 'Cliente actualizado', cliente });
    } catch (err) {
        console.error('Error en PUT /clientes/:id:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Cliente no encontrado (ID mal formado)' });
        }
        res.status(500).send('Error del Servidor');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        let cliente = await Client.findById(req.params.id);

        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        if (cliente.usuarioId.toString() !== req.User.id) {
            return res.status(401).json({ msg: 'No autorizado para eliminar este cliente' });
        }

        await Client.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Cliente eliminado' });
    } catch (err) {
        console.error('Error en DELETE /clientes/:id:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Cliente no encontrado (ID mal formado)' });
        }
        res.status(500).send('Error del Servidor');
    }
});

module.exports = router;
