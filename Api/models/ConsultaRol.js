import { getConnection } from "../models/connection";
import Joi from 'joi';

class ErrorRolExistente extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErrorRolExistente';
  }
}

const validarDatosRol = (nombre, estado) => {
  const schema = Joi.object({
    nombre: Joi.string().required().messages({
      'any.required': 'El nombre es obligatorio.',
      'string.empty': 'El nombre no puede estar vacío.',
    }),
    estado: Joi.string().required().messages({
      'any.required': 'El estado es obligatorio.',
      'string.empty': 'El estado no puede estar vacío.',
    }),
  });

  return schema.validate({ nombre, estado });
};

export const mostrarRoles = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT IdRol as Codigo, NombreRol as Nombre, Estado FROM Roles WHERE Estado = \'Activo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const guardarRol = async (nombre, estado) => {
  const validation = validarDatosRol(nombre, estado);

  if (validation.error) {
    throw new Error(validation.error.details[0].message);
  }

  const pool = await getConnection();
  const transaction = await pool.transaction();

  try {
    await transaction.begin(); // Inicia la transacción

    // Verifica si el rol ya existe
    const existingRol = await transaction
      .request()
      .input('nombre', nombre)
      .query('SELECT COUNT(*) as Count FROM Roles WHERE NombreRol = @nombre');

    if (existingRol.recordset[0].Count > 0) {
      throw new ErrorRolExistente('El rol ya existe.');
    }

    // Si no existe, realiza la inserción
    const result = await transaction
      .request()
      .input('nombre', nombre)
      .input('estado', estado)
      .query(`
        INSERT INTO Roles (NombreRol, Estado)
        VALUES (@nombre, @estado);

        SELECT SCOPE_IDENTITY() AS Codigo;
      `);

    await transaction.commit(); // Confirma la transacción
    return result.recordset[0].Codigo;
  } catch (error) {
    await transaction.rollback(); // Revierte la transacción en caso de error
    throw error;
  }
};

export const actualizarRol = async (codigo, nombre, estado) => {
  const validation = validarDatosRol(nombre, estado);

  if (validation.error) {
    throw new Error(validation.error.details[0].message);
  }

  const pool = await getConnection();
  const transaction = await pool.transaction();

  try {
    await transaction.begin(); // Inicia la transacción

    const result = await transaction
      .request()
      .input('codigo', codigo)
      .input('nombre', nombre)
      .input('estado', estado)
      .query(`
        UPDATE Roles
        SET NombreRol = @nombre, 
        Estado = @estado
        WHERE IdRol = @codigo;
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error('La actualización no afectó a ninguna fila. ¿El código proporcionado es válido?');
    }

    await transaction.commit(); // Confirma la transacción
  } catch (error) {
    await transaction.rollback(); // Revierte la transacción en caso de error
    throw error;
  }
};

export const darDeBajaRol = async (codigo) => {
  const pool = await getConnection();
  const transaction = await pool.transaction();

  try {
    await transaction.begin(); // Inicia la transacción

    await transaction
      .request()
      .input('codigo', codigo)
      .query('UPDATE Roles SET Estado = \'Inactivo\' WHERE IdRol = @codigo');

    await transaction.commit(); // Confirma la transacción
  } catch (error) {
    await transaction.rollback(); // Revierte la transacción en caso de error
    throw error;
  }
};

export const activarRol = async (codigo) => {
  const pool = await getConnection();
  const transaction = await pool.transaction();

  try {
    await transaction.begin(); // Inicia la transacción

    await transaction
      .request()
      .input('codigo', codigo)
      .query('UPDATE Roles SET Estado = \'Activo\' WHERE IdRol = @codigo');

    await transaction.commit(); // Confirma la transacción
  } catch (error) {
    await transaction.rollback(); // Revierte la transacción en caso de error
    throw error;
  }
};
