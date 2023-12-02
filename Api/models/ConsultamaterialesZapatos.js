import Joi from 'joi';
import { getConnection } from "../models/connection";

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class MaterialExistenteError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MaterialExistenteError';
  }
}

export const mostrarMaterialesZapatos = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT ID_MaterialZapatos as Codigo, Nombre, Descripcion, TipoMaterial, TipodeCostura, TipoSuela, Fabricante, Observaciones, Estado FROM MaterialesZapatos WHERE Estado = \'Activo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const guardarMaterialZapatos = async (nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado) => {
  try {
    // Validación de datos con Joi
    const schema = Joi.object({
      nombre: Joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
        'any.required': 'El nombre es obligatorio.',
        'string.empty': 'El nombre no puede estar vacío.',
        'string.pattern.base': 'El nombre debe contener solo letras y espacios.',
      }),
      descripcion: Joi.string().required().messages({
        'any.required': 'La descripción es obligatoria.',
        'string.empty': 'La descripción no puede estar vacía.',
      }),
      tipoMaterial: Joi.string().required().messages({
        'any.required': 'El tipo de material es obligatorio.',
        'string.empty': 'El tipo de material no puede estar vacío.',
      }),
      tipodeCostura: Joi.string().required().messages({
        'any.required': 'El tipo de costura es obligatorio.',
        'string.empty': 'El tipo de costura no puede estar vacío.',
      }),
      tipoSuela: Joi.string().required().messages({
        'any.required': 'El tipo de suela es obligatorio.',
        'string.empty': 'El tipo de suela no puede estar vacío.',
      }),
      fabricante: Joi.string().required().messages({
        'any.required': 'El fabricante es obligatorio.',
        'string.empty': 'El fabricante no puede estar vacío.',
      }),
      observaciones: Joi.string().required().messages({
        'any.required': 'Las observaciones son obligatorias.',
        'string.empty': 'Las observaciones no pueden estar vacías.',
      }),
      estado: Joi.string().required().messages({
        'any.required': 'El estado es obligatorio.',
        'string.empty': 'El estado no puede estar vacío.',
      }),
    });

    const validationResult = schema.validate({ nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado });

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.details[0].message);
    }

    const pool = await getConnection();

    // Verifica si el material ya existe
    const existingMaterial = await pool
      .request()
      .input('nombre', nombre)
      .query('SELECT TOP 1 1 FROM MaterialesZapatos WHERE Nombre = @nombre');

    if (existingMaterial.recordset.length > 0) {
      throw new MaterialExistenteError('El material ya existe.');
    }

    // Si no existe, realiza la inserción
    const result = await pool
      .request()
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .input('tipoMaterial', tipoMaterial)
      .input('tipodeCostura', tipodeCostura)
      .input('tipoSuela', tipoSuela)
      .input('fabricante', fabricante)
      .input('observaciones', observaciones)
      .input('estado', estado)
      .query(`
        INSERT INTO MaterialesZapatos (Nombre, Descripcion, TipoMaterial, TipodeCostura, TipoSuela, Fabricante, Observaciones, Estado)
        OUTPUT INSERTED.ID_MaterialZapatos AS Codigo
        VALUES (@nombre, @descripcion, @tipoMaterial, @tipodeCostura, @tipoSuela, @fabricante, @observaciones, @estado)
      `);

    return result.recordset[0].Codigo;
  } catch (error) {
    throw error;
  }
};

export const actualizarMaterialZapatos = async (codigo, nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('codigo', codigo)
      .input('nombre', nombre)
      .input('descripcion', descripcion)
      .input('tipoMaterial', tipoMaterial)
      .input('tipodeCostura', tipodeCostura)
      .input('tipoSuela', tipoSuela)
      .input('fabricante', fabricante)
      .input('observaciones', observaciones)
      .input('estado', estado)
      .query(`
        UPDATE MaterialesZapatos
        SET Nombre = @nombre,
            Descripcion = @descripcion,
            TipoMaterial = @tipoMaterial,
            TipodeCostura = @tipodeCostura,
            TipoSuela = @tipoSuela,
            Fabricante = @fabricante,
            Observaciones = @observaciones,
            Estado = @estado
        WHERE ID_MaterialZapatos = @codigo
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error('La actualización no afectó a ninguna fila. ¿El código proporcionado es válido?');
    }
  } catch (error) {
    throw error;
  }
};

export const darDeBajaMaterialZapatos = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE MaterialesZapatos SET Estado = \'Inactivo\' WHERE ID_MaterialZapatos = @codigo');
  } catch (error) {
    throw error;
  }
};

export const activarMaterialZapatos = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE MaterialesZapatos SET Estado = \'Activo\' WHERE ID_MaterialZapatos = @codigo');
  } catch (error) {
    throw error;
  }
};
