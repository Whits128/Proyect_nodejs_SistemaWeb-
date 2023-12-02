// bodegaValidationMiddleware.js
import { body, validationResult } from 'express-validator';

export const validateBodega = [
  body('nombre')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Ingrese un nombre y apellido completo')
    .isLength({ min: 5 })
    .withMessage('El nombre y apellido deben tener al menos 5 caracteres'),

  body('ubicacion')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Ingrese una bodega ')
    .isLength({ min: 5 })
    .withMessage('El nombre y apellido deben tener al menos 5 caracteres'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(req.body);
    const valores = req.body;
    const validaciones = errors.array();
    return res.render('CtlBodega', { pageTitle: 'Bodega', validaciones: validaciones, valores: valores });
  }

  next();
};
