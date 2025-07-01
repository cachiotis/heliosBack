const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    console.log(`[Auth Middleware] Ruta: ${req.method} ${req.path}`);
    console.log('[Auth Middleware] Cabeceras recibidas:', JSON.stringify(req.headers, null, 2));

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
        req.User = { id: decoded.id };    // LÍNEA CORREGIDA (U mayúscula)

        next(); // continuar al siguiente middleware o ruta
    } catch (err) {
        console.error('Error de verificación de token:', err.name, err.message); // Log más detallado
        res.status(401).json({ msg: 'Token no válido', errorType: err.name }); // Opcional: enviar tipo de error al cliente
    }
}

module.exports = auth;
