import { getConnection } from "../models/connection";
import Joi from 'joi';

const validarDatosPromocion = (nombre, descripcion, fechaInicio, fechaFin, estado) => {
  const schema = Joi.object({
    nombre: Joi.string().required().messages({
      'any.required': 'El nombre es obligatorio.',
      'string.empty': 'El nombre no puede estar vacío.',
    }),
    descripcion: Joi.string().required().messages({
      'any.required': 'La descripción es obligatoria.',
      'string.empty': 'La descripción no puede estar vacía.',
    }),
    fechaInicio: Joi.date().iso().required().messages({
      'any.required': 'La fecha de inicio es obligatoria.',
      'date.format': 'La fecha de inicio debe tener un formato ISO.',
    }),
    fechaFin: Joi.date().iso().required().messages({
      'any.required': 'La fecha de fin es obligatoria.',
      'date.format': 'La fecha de fin debe tener un formato ISO.',
    }),
    estado: Joi.string().required().messages({
      'any.required': 'El estado es obligatorio.',
      'string.empty': 'El estado no puede estar vacío.',
    }),
  });

  return schema.validate({ nombre, descripcion, fechaInicio, fechaFin, estado });
};

export const mostrarPromociones = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT ID_Promocion as Codigo, Nombre, Descripcion, FechaInicio, FechaFin, Estado FROM Promociones WHERE Estado = \'Activo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const guardarPromocion = async (nombre, descripcion, fechaInicio, fechaFin, estado) => {
  try {
    const validation = validarDatosPromocion(nombre, descripcion, fechaInicio, fechaFin, estado);

    if (validation.error) {
      throw new Error(validation.error.details[0].message);
    }

    const pool = await getConnection();

    // Verifica si la promoción ya existe
    const existingPromocion = await pool
      .request()
      .input('nombre', nombre)
      .query('SELECT TOP 1 1 FROM Promociones WHERE Nombre = @nombre');

    if (existingPromocion.recordset.length > 0) {
      throw new Error('La promoción ya existe.');
    }

    // Si no existe, realiza la inserción
    const result = await pool
      .request()
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .input('fechaInicio', fechaInicio)
      .input('fechaFin', fechaFin)
      .input('estado', estado)
      .query(`
        INSERT INTO Promociones (Nombre, Descripcion, FechaInicio, FechaFin, Estado)
        OUTPUT INSERTED.ID_Promocion AS Codigo
        VALUES (@nombre, @descripcion, @fechaInicio, @fechaFin, @estado)
      `);

    return result.recordset[0].Codigo;
  } catch (error) {
    throw error;
  }
};

export const actualizarPromocion = async (codigo, nombre, descripcion, fechaInicio, fechaFin, estado) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('codigo', codigo)
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .input('fechaInicio', fechaInicio)
      .input('fechaFin', fechaFin)
      .input('estado', estado)
      .query(`
        UPDATE Promociones
        SET Nombre = @nombre,
            Descripcion = @descripcion,
            FechaInicio = @fechaInicio,
            FechaFin = @fechaFin,
            Estado = @estado
        WHERE ID_Promocion = @codigo
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error('La actualización no afectó a ninguna fila. ¿El código proporcionado es válido?');
    }
  } catch (error) {
    throw error;
  }
};

export const darDeBajaPromocion = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Promociones SET Estado = \'Inactivo\' WHERE ID_Promocion = @codigo');
  } catch (error) {
    throw error;
  }
};

export const activarPromocion = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Promociones SET Estado = \'Activo\' WHERE ID_Promocion = @codigo');
  } catch (error) {
    throw error;
  }
};
