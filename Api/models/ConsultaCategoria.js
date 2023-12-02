import Joi from 'joi';
import { getConnection } from "../models/connection";

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class CategoriaExistenteError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CategoriaExistenteError';
  }
}

export const mostrarCategorias = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT ID_Categoria as Codigo, Nombre as Nombre, Estado as Estado FROM Categorias WHERE Estado = \'Activo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const guardarCategoria = async (nombre, estado) => {
  try {
    // Validación de datos con Joi
    const schema = Joi.object({
      nombre: Joi.string().pattern(/^[a-zA-Z]+$/).required().messages({
        'any.required': 'El nombre es obligatorio.',
        'string.empty': 'El nombre no puede estar vacío.',
        'string.pattern.base': 'El nombre debe contener solo letras.',
      }),
      estado: Joi.string().required().messages({
        'any.required': 'El estado es obligatorio.',
        'string.empty': 'El estado no puede estar vacío.',
      }),
    });

    const validationResult = schema.validate({ nombre, estado });

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.details[0].message);
    }

    const pool = await getConnection();

    // Verifica si la categoría ya existe
    const existingCategoria = await pool
      .request()
      .input('nombre', nombre)
      .query('SELECT TOP 1 1 FROM Categorias WHERE Nombre = @nombre');

    if (existingCategoria.recordset.length > 0) {
      throw new CategoriaExistenteError('La categoría ya existe.');
    }

    // Si no existe, realiza la inserción
    const result = await pool
      .request()
      .input('nombre', nombre)
      .input('estado', estado)
      .query(`
        INSERT INTO Categorias (Nombre, Estado)
        OUTPUT INSERTED.ID_Categoria AS Codigo
        VALUES (@nombre, @estado)
      `);

    return result.recordset[0].Codigo;
  } catch (error) {
    throw error;
  }
};

export const updateCategoria = async (codigo, nombre, estado) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('codigo', codigo)
      .input('nombre', nombre)
      .input('estado', estado)
      .query('UPDATE Categorias SET Nombre = @nombre, Estado = @estado WHERE ID_Categoria = @codigo');

    if (result.rowsAffected[0] === 0) {
      throw new Error('La actualización no afectó a ninguna fila. ¿El código proporcionado es válido?');
    }
  } catch (error) {
    throw error;
  }
};

export const darDeBajaCategoria = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Categorias SET Estado = \'Inactivo\' WHERE ID_Categoria = @codigo');
  } catch (error) {
    throw error;
  }
};

export const activarCategoria = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Categorias SET Estado = \'Activo\' WHERE ID_Categoria = @codigo');
  } catch (error) {
    throw error;
  }
};
