import Joi from 'joi';
import { getConnection } from "../models/connection";

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class BodegaExistenteError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BodegaExistenteError';
  }
}

export const mostrarBodegas = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT ID_BODEGA as Codigo, NOMBRE as Nombre, UBICACION as Ubicacion, Estado FROM BODEGA  WHERE Estado = \'Activo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const guardarBodega = async (nombre, ubicacion, estado) => {
  try {
    // Validación de datos con Joi
    const schema = Joi.object({
      nombre: Joi.string().pattern(/^[a-zA-Z]+$/).required().messages({
        'any.required': 'El nombre es obligatorio.',
        'string.empty': 'El nombre no puede estar vacío.',
        'string.pattern.base': 'El nombre debe contener solo letras.',
      }),
      ubicacion: Joi.string().required().messages({
        'any.required': 'La ubicación es obligatoria.',
        'string.empty': 'La ubicación no puede estar vacía.',
      }),
      estado: Joi.string().required().messages({
        'any.required': 'El estado es obligatorio.',
        'string.empty': 'El estado no puede estar vacío.',
      }),
    });

    const validationResult = schema.validate({ nombre, ubicacion, estado });

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.details[0].message);
    }

    const pool = await getConnection();

    // Verifica si la bodega ya existe
    const existingBodega = await pool
      .request()
      .input('nombre', nombre)
      .query('SELECT TOP 1 1 FROM BODEGA WHERE NOMBRE = @nombre');

    if (existingBodega.recordset.length > 0) {
      throw new BodegaExistenteError('La bodega ya existe.');
    }

    // Si no existe, realiza la inserción
    const result = await pool
      .request()
      .input('nombre', nombre)
      .input('ubicacion', ubicacion)
      .input('estado', estado)
      .query(`
        INSERT INTO BODEGA (NOMBRE, UBICACION, Estado)
        OUTPUT INSERTED.ID_BODEGA AS Codigo
        VALUES (@nombre, @ubicacion, @estado)
      `);

    return result.recordset[0].Codigo;
  } catch (error) {
    throw error;
  }
};

export const actualizarBodega = async (codigo, nombre, ubicacion, estado) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('codigo', codigo)
      .input('nombre', nombre)
      .input('ubicacion', ubicacion)
      .input('estado', estado)
      .query(`
        UPDATE BODEGA
        SET NOMBRE = @nombre,
            UBICACION = @ubicacion,
            Estado = @estado
        WHERE ID_BODEGA = @codigo
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error('La actualización no afectó a ninguna fila. ¿El código proporcionado es válido?');
    }
  } catch (error) {
    throw error;
  }
};

export const darDeBajaBodega = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE BODEGA SET Estado = \'Inactivo\' WHERE ID_BODEGA = @codigo');
  } catch (error) {
    throw error;
  }
};

export const activarBodega = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE BODEGA SET Estado = \'Activo\' WHERE ID_BODEGA = @codigo');
  } catch (error) {
    throw error;
  }
};
