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
  let pool;
  try {
    pool = await getConnection();
    const result = await pool
      .request()
      .query(`SELECT E.ID_Empleado as Codigo, Nombre, E.Apellido, E.Direccion, Telefono,U.IdUsuario,U.LoginUsuario, E.Estado FROM Empleados E
      INNER JOIN USUARIO U ON U.IdUsuario =E.idUsuario WHERE E.Estado = \'Activo\'`);
    return result.recordset;
  } catch (error) {
    throw error;
  } finally {
    if (pool) {
      try {
        pool.close();
        console.log('Conexión cerrada correctamente.');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err.message);
      }
    }
  }
};


export const guardarEmpleado = async (nombre, apellido, direccion, telefono,idUsuario, estado) => {
  let pool;
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

   pool = await getConnection();

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
      .input('idUsuario', idUsuario)
      .input('estado', estado)
      .query(`
        INSERT INTO Empleados (Nombre, Apellido, Direccion, Telefono,IdUsuario, Estado)
        OUTPUT INSERTED.ID_Empleado AS Codigo
        VALUES (@nombre, @apellido, @direccion, @telefono,@idUsuario, @estado)
      `);

    return result.recordset[0].Codigo;
  } catch (error) {
    throw error;
  }finally {
    if (pool) {
      try {
        pool.close();
        console.log('Conexión cerrada correctamente.');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err.message);
      }
    }
  }

};

export const actualizarEmpleado = async (codigo, nombre, apellido, direccion, telefono,idUsuario, estado) => {
  let pool;
  try {
     pool = await getConnection();
    const result = await pool
      .request()
      .input('codigo', codigo)
      .input('nombre', nombre)
      .input('apellido', apellido)
      .input('direccion', direccion)
      .input('telefono', telefono)
      .input('idUsuario', idUsuario)
      .input('estado', estado)
      .query(`
        UPDATE Empleados
        SET Nombre = @nombre,
            Apellido = @apellido,
            Direccion = @direccion,
            Telefono = @telefono,
            IdUsuario =@idUsuario,
            Estado = @estado
        WHERE ID_Empleado = @codigo
      `);

    if (result.rowsAffected[0] === 0) {
      throw new Error('La actualización no afectó a ninguna fila. ¿El código proporcionado es válido?');
    }
  } catch (error) {
    throw error;
  }
  finally {
    if (pool) {
      try {
        pool.close();
        console.log('Conexión cerrada correctamente.');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err.message);
      }
    }
  }
};

export const darDeBajaEmpleado = async (codigo) => {
 let pool;
  try {
     pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Empleados SET Estado = \'Inactivo\' WHERE ID_Empleado = @codigo');
  } catch (error) {
    throw error;
  }finally {
    if (pool) {
      try {
        pool.close();
        console.log('Conexión cerrada correctamente.');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err.message);
      }
    }
  }
};

export const activarEmpleado = async (codigo) => {
 let pool;
  try {
     pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Empleados SET Estado = \'Activo\' WHERE ID_Empleado = @codigo');
  } catch (error) {
    throw error;
  }finally {
    if (pool) {
      try {
        pool.close();
        console.log('Conexión cerrada correctamente.');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err.message);
      }
    }
  }
};

export const existeEmpleadoPorUsuario = async (idUsuario) => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool
      .request()
      .input('idUsuario', idUsuario)
      .query('SELECT TOP 1 1 FROM Empleados WHERE IdUsuario = @idUsuario AND Estado = \'Activo\'');

    return result.recordset.length > 0;
  } catch (error) {
    throw error;
  } finally {
    if (pool) {
      try {
        pool.close();
        console.log('Conexión cerrada correctamente.');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err.message);
      }
    }
  }
};


