import Joi from 'joi';
import { getConnection } from "../models/connection";

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class ProveedorExistenteError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ProveedorExistenteError';
  }
}

export const mostrarProveedores = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT ID_Proveedor as Codigo, Nombre, Direccion, Telefono, Ruc, EmailProveedor, Estado FROM Proveedores WHERE Estado = \'Activo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const guardarProveedor = async (nombre, direccion, telefono, ruc, emailProveedor, estado) => {
  try {
    const schema = Joi.object({
      nombre: Joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
        'any.required': 'El nombre es obligatorio.',
        'string.empty': 'El nombre no puede estar vacío.',
        'string.pattern.base': 'El nombre debe contener solo letras y espacios.',
    }),
      direccion: Joi.string().required().messages({
        'any.required': 'La dirección es obligatoria.',
        'string.empty': 'La dirección no puede estar vacía.',
      }),
      telefono: Joi.string().pattern(/^[\d-]+$/).required().messages({
        'any.required': 'El teléfono es obligatorio.',
        'string.empty': 'El teléfono no puede estar vacío.',
        'string.pattern.base': 'El teléfono debe contener solo números y guiones.',
    }),
      ruc: Joi.string().allow(null).messages({
        'string.empty': 'El RUC no puede estar vacío.',
      }),
      emailProveedor: Joi.string().email().required().messages({
        'any.required': 'El email del proveedor es obligatorio.',
        'string.empty': 'El email del proveedor no puede estar vacío.',
        'string.email': 'El email del proveedor debe tener un formato válido.',
      }),
      estado: Joi.string().required().messages({
        'any.required': 'El estado es obligatorio.',
        'string.empty': 'El estado no puede estar vacío.',
      }),
    });

    const validationResult = schema.validate({ nombre, direccion, telefono, ruc, emailProveedor, estado });

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.details[0].message);
    }

    const pool = await getConnection();

    const existingProveedor = await pool
      .request()
      .input('nombre', nombre)
      .query('SELECT TOP 1 1 FROM Proveedores WHERE Nombre = @nombre');

    if (existingProveedor.recordset.length > 0) {
      throw new ProveedorExistenteError('El proveedor ya existe.');
    }

    const result = await pool
      .request()
      .input('nombre', nombre)
      .input('direccion', direccion)
      .input('telefono', telefono)
      .input('ruc', ruc)
      .input('emailProveedor', emailProveedor)
      .input('estado', estado)
      .query(`
        INSERT INTO Proveedores (Nombre, Direccion, Telefono, Ruc, EmailProveedor, Estado)
        OUTPUT INSERTED.ID_Proveedor AS Codigo
        VALUES (@nombre, @direccion, @telefono, @ruc, @emailProveedor, @estado)
      `);

    return result.recordset[0].Codigo;
  } catch (error) {
    throw error;
  }
};

export const actualizarProveedor = async (codigo, nombre, direccion, telefono, ruc, emailProveedor, estado) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('codigo', codigo)
      .input('nombre', nombre)
      .input('direccion', direccion)
      .input('telefono', telefono)
      .input('ruc', ruc)
      .input('emailProveedor', emailProveedor)
      .input('estado', estado)
      .query(`
        UPDATE Proveedores
        SET Nombre = @nombre,
            Direccion = @direccion,
            Telefono = @telefono,
            Ruc = @ruc,
            EmailProveedor = @emailProveedor,
            Estado = @estado
        WHERE ID_Proveedor = @codigo
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error('La actualización no afectó a ninguna fila. ¿El código proporcionado es válido?');
    }
  } catch (error) {
    throw error;
  }
};

export const darDeBajaProveedor = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Proveedores SET Estado = \'Inactivo\' WHERE ID_Proveedor = @codigo');
  } catch (error) {
    throw error;
  }
};

export const activarProveedor = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Proveedores SET Estado = \'Activo\' WHERE ID_Proveedor = @codigo');
  } catch (error) {
    throw error;
  }
};
