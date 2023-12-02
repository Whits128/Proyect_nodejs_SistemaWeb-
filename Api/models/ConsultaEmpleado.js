import Joi from 'joi';
import { getConnection } from "../models/connection";

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class EmpleadoExistenteError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmpleadoExistenteError';
  }
}

export const mostrarEmpleados = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT ID_Empleado as Codigo, Nombre, Apellido, Direccion, Telefono, Estado FROM Empleados');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const guardarEmpleado = async (nombre, apellido, direccion, telefono, estado) => {
  try {
    // Validación de datos con Joi
    const schema = Joi.object({
      nombre: Joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
        'any.required': 'El nombre es obligatorio.',
        'string.empty': 'El nombre no puede estar vacío.',
        'string.pattern.base': 'El nombre debe contener solo letras y espacios.',
    }),
    
      apellido: Joi.string().required().messages({
        'any.required': 'El apellido es obligatorio.',
        'string.empty': 'El apellido no puede estar vacío.',
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
    
      estado: Joi.string().required().messages({
        'any.required': 'El estado es obligatorio.',
        'string.empty': 'El estado no puede estar vacío.',
      }),
    });

    const validationResult = schema.validate({ nombre, apellido, direccion, telefono, estado });

    if (validationResult.error) {
      throw new ValidationError(validationResult.error.details[0].message);
    }

    const pool = await getConnection();

    // Verifica si el empleado ya existe
    const existingEmpleado = await pool
      .request()
      .input('nombre', nombre)
      .query('SELECT TOP 1 1 FROM Empleados WHERE Nombre = @nombre');

    if (existingEmpleado.recordset.length > 0) {
      throw new EmpleadoExistenteError('El empleado ya existe.');
    }

    // Si no existe, realiza la inserción
    const result = await pool
      .request()
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('direccion', direccion)
      .input('telefono', telefono)
      .input('estado', estado)
      .query(`
        INSERT INTO Empleados (Nombre, Apellido, Direccion, Telefono, Estado)
        OUTPUT INSERTED.ID_Empleado AS Codigo
        VALUES (@nombre, @apellido, @direccion, @telefono, @estado)
      `);

    return result.recordset[0].Codigo;
  } catch (error) {
    throw error;
  }
};

export const actualizarEmpleado = async (codigo, nombre, apellido, direccion, telefono, estado) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('codigo', codigo)
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('direccion', direccion)
      .input('telefono', telefono)
      .input('estado', estado)
      .query(`
        UPDATE Empleados
        SET Nombre = @nombre,
            Apellido = @apellido,
            Direccion = @direccion,
            Telefono = @telefono,
            Estado = @estado
        WHERE ID_Empleado = @codigo
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error('La actualización no afectó a ninguna fila. ¿El código proporcionado es válido?');
    }
  } catch (error) {
    throw error;
  }
};

export const darDeBajaEmpleado = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Empleados SET Estado = \'Inactivo\' WHERE ID_Empleado = @codigo');
  } catch (error) {
    throw error;
  }
};

export const activarEmpleado = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Empleados SET Estado = \'Activo\' WHERE ID_Empleado = @codigo');
  } catch (error) {
    throw error;
  }
};
