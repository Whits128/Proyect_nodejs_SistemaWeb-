import { sql, getConnection } from "../models/connection";
import Joi from 'joi';

const validarDatosTalla = (NumeroTalla, estado) => {
  const schema = Joi.object({
    NumeroTalla: Joi.string().required().messages({
      'any.required': 'El número de talla es obligatorio.',
      'string.empty': 'El número de talla no puede estar vacío.',
    }),
    estado: Joi.string().required().messages({
      'any.required': 'El estado es obligatorio.',
      'string.empty': 'El estado no puede estar vacío.',
    }),
  });

  return schema.validate({ NumeroTalla, estado });
};

export const mostrarTallas = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT ID_Talla as Codigo, NumeroTalla, Estado FROM Tallas WHERE Estado = \'Activo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const guardarTallas = async (NumeroTalla, estado) => {
  try {
    const validation = validarDatosTalla(NumeroTalla, estado);

    if (validation.error) {
      throw new Error(validation.error.details[0].message);
    }

    const pool = await getConnection();

    // Verifica si la talla ya existe
    const existingTalla = await pool
      .request()
      .input('NumeroTalla', NumeroTalla)
      .query('SELECT TOP 1 1 FROM Tallas WHERE NumeroTalla = @NumeroTalla');

    if (existingTalla.recordset.length > 0) {
      throw new Error('El número de talla ya existe.');
    }

    // Si no existe, realiza la inserción
    const result = await pool
      .request()
      .input('NumeroTalla', NumeroTalla)
      .input('estado', estado)
      .query('INSERT INTO Tallas (NumeroTalla, Estado) VALUES (@NumeroTalla, @estado); SELECT SCOPE_IDENTITY() AS codigo');

    return result.recordset[0].codigo;
  } catch (error) {
    throw error;
  }
};

export const actualizarTallas = async (codigo, NumeroTalla, estado) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('codigo', codigo)
      .input('NumeroTalla', sql.VarChar, NumeroTalla)
      .input('estado', sql.VarChar, estado)
      .query('UPDATE Tallas SET NumeroTalla = @NumeroTalla, Estado = @estado WHERE ID_Talla = @codigo');

    console.log(result); // Log the result to check for any errors
    console.log(result.rowsAffected); // Log the number of rows affected
  } catch (error) {
    throw error;
  }
};

export const darDeBajaTallas = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Tallas SET Estado = \'Inactivo\' WHERE ID_Talla = @codigo');
  } catch (error) {
    throw error;
  }
};

export const activarTallas = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Tallas SET Estado = \'Activo\' WHERE ID_Talla = @codigo');
  } catch (error) {
    throw error;
  }
};
