import { body, validationResult } from 'express-validator';

export const validateTalla = [
    body('nya')
        .exists({ checkFalsy: true, checkNull: true }).withMessage('Ingrese un nombre y apellido completo')
        .isLength({ min: 5 }).withMessage('El nombre y apellido deben tener al menos 5 caracteres'),

    body('email', 'Ingrese un E-mail válido')
        .exists()
        .isEmail(),

    body('edad', 'Ingrese un valor numérico')        
        .exists()
        .isNumeric(),
    
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            res.send('¡Validación Exitosa!');
        }
    }
];
