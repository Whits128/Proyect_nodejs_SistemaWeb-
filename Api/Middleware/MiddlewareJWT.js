import jwt from 'jsonwebtoken';
import config from '../../Config/config';

const secretKey = config.JWT_SECRET;

// Middleware para crear un token JWT
export const createToken = async (user) => {
    try {
        // Crear el token con la información del usuario y la clave secreta
        const token = jwt.sign(user, secretKey, { expiresIn: '12h' });

        // Devolver el token
        return token;
    } catch (error) {
        // Manejar errores, puedes lanzar una excepción o devolver un valor predeterminado según tus necesidades
        console.error('Error al crear el token:', error.message);
        throw new Error('Error al crear el token');
    }
}

// Middleware para validar un token JWT de sesión
export const verifyToken = async (token) => {
    try {
        // Verificar y decodificar el token utilizando la clave secreta
        const decoded = jwt.verify(token, secretKey);

        // Devolver la información decodificada
        return decoded;
    } catch (error) {
        // Manejar errores, por ejemplo, token expirado
        console.error('Error al verificar el token:', error.message);

        // Puedes lanzar una excepción específica si el token ha expirado
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token expirado');
        }

        // O simplemente retornar null o algún valor predeterminado para indicar que la verificación falló
        return null;
    }
}
