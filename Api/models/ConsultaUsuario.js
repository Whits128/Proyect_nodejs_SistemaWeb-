import {sql, getConnection } from "../models/connection";
import bcrypt from 'bcrypt';
import Joi from 'joi';
export const mostrarUsuarios = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(`SELECT U.IdUsuario as Codigo, U.Nombres, U.Apellidos, U.LoginUsuario, R.NombreRol, U.Estado, U.FechaRegistro
      FROM USUARIO U
      INNER JOIN Roles R ON U.IdRol = R.IdRol
      WHERE U.Estado = \'Activo\'`);
    return result.recordset;
  } catch (error) {
    throw error;
  }
};


export const obtenerNombreUsuarioYRol = async (loginUsuario) => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('loginUsuario', sql.NVarChar(50), loginUsuario)
        .query(`
          
  SELECT U.IdUsuario, U.Nombres AS NombresUsuario, U.Apellidos AS ApellidosUsuario,
  R.NombreRol, R.IdRol,
  E.ID_Empleado, E.Nombre AS NombreEmpleado, E.Apellido AS ApellidoEmpleado
FROM USUARIO U
INNER JOIN Roles R ON U.IdRol = R.IdRol
LEFT JOIN Empleados E ON U.IdUsuario = E.idUsuario
WHERE U.LoginUsuario = @loginUsuario;
        `);
  
      return result.recordset[0];
    } catch (error) {
      console.error('Error al obtener el nombre y rol del usuario:', error.message);
      throw error;
    }
  };


  export const obtenerTotalUsuarios = async () => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .query('SELECT COUNT(*) AS TotalUsuarios FROM USUARIO');

        return result.recordset[0].TotalUsuarios;
    } catch (error) {
        console.error('Error al obtener el total de usuarios:', error.message);
        throw error;
    }
};



export const registerUser = async (Nombres, Apellidos, LoginUsuario, Contrasena, IdRol, Estado ,UsuarioModificacion) => {
  try {
   // Validación de datos con Joi
   const schema = Joi.object({
    Nombres: Joi.string().required().messages({
      'any.required': 'El nombre es obligatorio.',
      'string.empty': 'El nombre no puede estar vacío.',
    }),
    Apellidos: Joi.string().required().messages({
      'any.required': 'Los apellidos son obligatorios.',
      'string.empty': 'Los apellidos no pueden estar vacíos.',
    }),
    LoginUsuario: Joi.string().required().messages({
      'any.required': 'El nombre de usuario es obligatorio.',
      'string.empty': 'El nombre de usuario no puede estar vacío.',
    }),
    Contrasena: Joi.string().required().messages({
      'any.required': 'La contraseña es obligatoria.',
      'string.empty': 'La contraseña no puede estar vacía.',
    }),
    IdRol: Joi.number().required().messages({
      'any.required': 'El ID de rol es obligatorio.',
      'number.base': 'El ID de rol debe ser un número.',
    }),
    Estado: Joi.string().required().messages({
      'any.required': 'El estado es obligatorio.',
      'string.empty': 'El estado no puede estar vacío.',
    }),
  });

  const validationResult = schema.validate({ Nombres, Apellidos, LoginUsuario, Contrasena, IdRol, Estado });

  if (validationResult.error) {
    throw new Error(validationResult.error.details[0].message);
  }


    const LoginClave = await bcrypt.hash(Contrasena, 10); // Hash de la contraseña

    const pool = await getConnection();

    // Verifica si el usuario ya existe
    const existingUser = await pool
      .request()
      .input('LoginUsuario', LoginUsuario)
      .query('SELECT TOP 1 1 FROM USUARIO WHERE LoginUsuario = @LoginUsuario');

    if (existingUser.recordset.length > 0) {
      throw new Error('El nombre de usuario ya existe.');
    }

    // Si no existe, realiza la inserción llamando al procedimiento almacenado
    const result = await pool
    .request()
    .input('Nombres', Nombres)
    .input('Apellidos', Apellidos)
    .input('LoginUsuario', LoginUsuario)
    .input('LoginClave', LoginClave)
    .input('IdRol', IdRol)
    .input('Estado', Estado)
    .input('UsuarioModificacion', UsuarioModificacion) // Asegúrate de que este valor sea "Omar" o el usuario correcto que realiza la modificación
    .execute('InsertarUsuario'); // Llamada al procedimiento almacenado


    return result.returnValue; // Puede necesitar ajustar esto según cómo se retorna el código del nuevo usuario
  } catch (error) {
    throw error;
  }
};




export const updateUser = async (codigo, Nombres, Apellidos, LoginUsuario, IdRol, UsuarioModificacion) => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool
      .request()
      .input('UsuarioID', codigo)
      .input('Nombres', Nombres)
      .input('Apellidos', Apellidos)
      .input('LoginUsuario', LoginUsuario)
      .input('IdRol', IdRol)
      .input('UsuarioModificacion', UsuarioModificacion)
      .execute('ActualizarUsuario');

    // Verifica si no hay errores en la respuesta
    if (!result.rowsAffected || result.rowsAffected[0] === 0) {
      // No se realizaron cambios en la base de datos
      console.log('No se realizaron cambios en la base de datos');
      return { status: 304 }; // Puedes usar 304 para indicar que no se realizaron modificaciones
    }

    // Cambios realizados con éxito
    return { status: 200 };
  } catch (error) {
    throw error;
  } finally {
    // Asegúrate de cerrar la conexión en el bloque finally.
    if (pool) {
      try {
        await pool.close();
      } catch (error) {
        console.error('Error al cerrar la conexión:', error.message);
      }
    }
  }
};




export const actualizarContrasena = async (Codigo, Contrasena, UsuarioModificacion) => {
  let pool;
  try {
    pool = await getConnection();
    const LoginClave = await bcrypt.hash(Contrasena, 10); // Hash de la contraseña
    const result = await pool
      .request()
      .input('UsuarioID', Codigo)
      .input('LoginClave', LoginClave)
      .input('UsuarioModificacion', UsuarioModificacion)
      .execute('ActualizarContrasena');
      if (!result.rowsAffected || result.rowsAffected[0] === 0) {
        // No se realizaron cambios en la base de datos
        console.log('No se realizaron cambios en la base de datos');
        return { status: 304 }; // Puedes usar 304 para indicar que no se realizaron modificaciones
      }
  
      // Cambios realizados con éxito
      return { status: 200 };
  } catch (error) {
    throw error;
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (error) {
        console.error('Error al cerrar la conexión:', error.message);
      }
    }
  }
};


export const getHistorialUsuarioPorLogin = async (loginUsuario) => {
  let pool;
  try {
    pool = await getConnection();
   

    const result = await pool
      .request()
      .input('LoginUsuario', loginUsuario)
      .query('SELECT * FROM VistaHistorialUsuario WHERE LoginUsuario = @LoginUsuario');
 
      return result.recordset;
  } catch (error) {
    throw error;
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch (error) {
        console.error('Error al cerrar la conexión:', error.message);
      }
    }
  }
};




export const darDeBajaUsuario = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE USUARIO SET Estado = \'Inactivo\' WHERE IdUsuario = @codigo');
  } catch (error) {
    throw error;
  }
};

export const activarUsuario = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE USUARIO SET Estado = \'Activo\' WHERE IdUsuario = @codigo');
  } catch (error) {
    throw error;
  }
};
