import Joi from 'joi';
import { getConnection } from "../models/connection";

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class ColorExistenteError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ColorExistenteError';
  }
}

export const mostrarColores = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT ID_Colores as Codigo, Color as Color, Estado as Estado FROM Colores WHERE Estado = \'Activo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const guardarColor = async (color, estado) => {
  try {
    // Validación de datos con Joi
    const schema = Joi.object({
      color: Joi.string().pattern(/^[a-zA-Z]+$/).required().messages({
        'any.required': 'El color es obligatorio.',
        'string.empty': 'El color no puede estar vacío.',
        'string.pattern.base': 'El nombre debe contener solo letras.',
      }),
      estado: Joi.string().required().messages({
        'any.required': 'El estado es obligatorio.',
        'string.empty': 'El estado no puede estar vacío.',
      }),
    });

    const validationResult = schema.validate({ color, estado });

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.details[0].message);
    }

    const pool = await getConnection();

    // Verifica si el color ya existe
    const existingColor = await pool
      .request()
      .input('color', color)
      .query('SELECT TOP 1 1 FROM Colores WHERE Color = @color');

    if (existingColor.recordset.length > 0) {
      throw new ColorExistenteError('El color ya existe.');
    }

    // Si no existe, realiza la inserción
    const result = await pool
      .request()
      .input('color', color)
      .input('estado', estado)
      .query(`
        INSERT INTO Colores (Color, Estado)
        OUTPUT INSERTED.ID_Colores AS Codigo
        VALUES (@color, @estado)
      `);

    return result.recordset[0].Codigo;
  } catch (error) {
    throw error;
  }
};

export const actualizarColor = async (codigo, color, estado) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('codigo', codigo)
      .input('color', color)
      .input('estado', estado)
      .query('UPDATE Colores SET Color = @color, Estado = @estado WHERE ID_Colores = @codigo');

    if (result.rowsAffected[0] === 0) {
      throw new Error('La actualización no afectó a ninguna fila. ¿El código proporcionado es válido?');
    }
  } catch (error) {
    throw error;
  }
};

export const darDeBajaColor = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Colores SET Estado = \'Inactivo\' WHERE ID_Colores = @codigo');
  } catch (error) {
    throw error;
  }
};

export const activarColor = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Colores SET Estado = \'Activo\' WHERE ID_Colores = @codigo');
  } catch (error) {
    throw error;
  }
};
