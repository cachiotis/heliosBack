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

// @route   DELETE api/clientes/:id
// @desc    Eliminar un cliente
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let cliente = await Client.findById(req.params.id);

        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        // Asegurarse que el usuario es dueño del cliente
        // Asumiendo que tu modelo Cliente tiene un campo 'usuarioId' que referencia al usuario
        // y que req.User.id es el id del usuario autenticado (establecido por el middleware auth).
        if (cliente.usuarioId.toString() !== req.User.id) {
            return res.status(401).json({ msg: 'No autorizado para eliminar este cliente' });
        }

        await Client.findByIdAndDelete(req.params.id);
        // O si usas Mongoose >= 5 y quieres el documento eliminado: await Client.findByIdAndRemove(req.params.id);

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
