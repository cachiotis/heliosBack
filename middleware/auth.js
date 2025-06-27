const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    // Espera que el token venga en el header:
    // Authorization: Bearer <token>
    const tokenHeader = req.header('Authorization');

    if (!tokenHeader) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    // Extraer el token quitando el "Bearer "
    const token = tokenHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Token mal formado' });
    }

    try {
        // Decodificar y verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // decoded será: { id: <user._id>, iat: ..., exp: ... }
        req.usuario = { id: decoded.id }; 

        next(); // continuar al siguiente middleware o ruta
    } catch (err) {
        console.error('Token inválido:', err);
        res.status(401).json({ msg: 'Token no válido' });
    }
}

module.exports = auth;
