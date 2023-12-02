// marcas.js

import { getConnection } from "../models/connection";
import Joi from 'joi';
export const mostrarMarcas = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT ID_Marca as Codigo, Nombre, DetalleMarca, Estado FROM Marcas WHERE Estado = \'Activo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const guardarMarca = async (nombre, detalleMarca, estado) => {
  try {
    // Validación de datos con Joi
    const schema = Joi.object({
      nombre: Joi.string().required().messages({
        'any.required': 'El nombre es obligatorio.',
        'string.empty': 'El nombre no puede estar vacío.',
      }),
      detalleMarca: Joi.string().required().messages({
        'any.required': 'El detalle de la marca es obligatorio.',
        'string.empty': 'El detalle de la marca no puede estar vacío.',
      }),
      estado: Joi.string().required().messages({
        'any.required': 'El estado es obligatorio.',
        'string.empty': 'El estado no puede estar vacío.',
      }),
    });

    const validationResult = schema.validate({ nombre, detalleMarca, estado });

    if (validationResult.error) {
      throw new Error(validationResult.error.details[0].message);
    }

    const pool = await getConnection();

    // Verifica si la marca ya existe
    const existingMarca = await pool
      .request()
      .input('nombre', nombre)
      .query('SELECT TOP 1 1 FROM Marcas WHERE Nombre = @nombre');

    if (existingMarca.recordset.length > 0) {
      throw new Error('La marca ya existe.');
    }

    // Si no existe, realiza la inserción
    const result = await pool
      .request()
      .input('nombre', nombre)
      .input('detalleMarca', detalleMarca)
      .input('estado', estado)
      .query(`
        INSERT INTO Marcas (Nombre, DetalleMarca, Estado)
        OUTPUT INSERTED.ID_Marca AS Codigo
        VALUES (@nombre, @detalleMarca, @estado)
      `);

    return result.recordset[0].Codigo;
  } catch (error) {
    throw error;
  }
};
export const actualizarMarca = async (codigo, nombre, detalleMarca, estado) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('codigo', codigo)
      .input('nombre', nombre)
      .input('detalleMarca', detalleMarca)
      .input('estado', estado)
      .query(`
        UPDATE Marcas
        SET Nombre = @nombre, DetalleMarca = @detalleMarca, Estado = @estado
        WHERE ID_Marca = @codigo
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error('La actualización no afectó a ninguna fila. ¿El código proporcionado es válido?');
    }
  } catch (error) {
    throw error;
  }
};

export const darDeBajaMarca = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Marcas SET Estado = \'Inactivo\' WHERE ID_Marca = @codigo');
  } catch (error) {
    throw error;
  }
};

export const activarMarca = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Marcas SET Estado = \'Activo\' WHERE ID_Marca = @codigo');
  } catch (error) {
    throw error;
  }
};
