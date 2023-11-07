const { getConnection, sql } = require("../DataBase");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
import config from "../config";
import { promisify } from 'util';

//seccion de registro
export const registerUser = async (req, res) => {
  try {
    const { Nombres, Apellidos,IdRol, LoginUsuario, LoginClave ,Estado} = req.body;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(LoginClave, 10);

    const pool = await getConnection();

    // Insertar el usuario en la base de datos
    await pool
      .request()
      .input('Nombres', sql.VarChar, Nombres)
      .input('Apellidos', sql.VarChar, Apellidos)
      .input('LoginUsuario', sql.VarChar, LoginUsuario)
      .input('LoginClave', sql.VarChar, hashedPassword)
      .input('IdRol', sql.Int, IdRol)
      .input('Estado', sql.VarChar, Estado)
      .query(
        'INSERT INTO USUARIO (Nombres, Apellidos, LoginUsuario, LoginClave,IdRol,Estado) VALUES (@Nombres, @Apellidos, @LoginUsuario, @LoginClave,@IdRol,@Estado)'
      );

    pool.close();

    res.render('Login', {
      alert: true,
      alertTitle: 'Registro Exitoso',
      alertMessage: '¡Usuario registrado con éxito!',
      alertIcon: 'success',
      showConfirmButton: true,
      timer: false,
      ruta: 'login'
    });
  } catch (error) {
    console.error('Error en el registro de usuario:', error);
    res.render('Login', {
      alert: true,
      alertTitle: 'Error',
      alertMessage: 'Error en el servidor',
      alertIcon: 'error',
      showConfirmButton: true,
      timer: false,
      ruta: 'login'
    });
  }
};



//seccion de logeo
export const Login = async (req, res) => {
  try {
    const user = req.body.user;
    const pass = req.body.pass;

    if (!user || !pass) {
      console.log('No se escribió usuario o contraseña.');
      return res.render('Login', {
        layout: false,
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un usuario y contraseña",
        alertIcon: 'info',
        showConfirmButton: true,
        timer: false,
        ruta: '/'
      });
    }

    const pool = await getConnection();
    try {
      const result = await pool
        .request()
        .input('user', sql.VarChar, user)
        .query('SELECT * FROM USUARIO WHERE LoginUsuario = @user');

      if (result.recordset.length === 0 || !(await bcrypt.compare(pass, result.recordset[0].LoginClave))) {
        console.log('Usuario y/o contraseña incorrectas.');
        return res.render('Login', {
          layout: false,
          alert: true,
          alertTitle: "Error",
          alertMessage: "Usuario y/o contraseña incorrectas",
          alertIcon: 'error',
          showConfirmButton: true,
          timer: false,
          ruta: '/'
        });
      } else {
        console.log('Usuario encontrado.');
        const id = result.recordset[0].IdUsuario;
        const token = jwt.sign({ id: id }, config.JWT_SECRET, {
          expiresIn: config.JWT_EXPIRES_IN
        });

        const cookieOptions = {
          expires: new Date(Date.now() + config.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
          path: "/"
        };
        res.cookie('jwt', token, cookieOptions);

        return res.redirect('/Inicio'); // Redirect to '/Inicios' on successful login
      }
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      return res.render('Login', {
        alert: true,
        alertTitle: 'Error',
        alertMessage: 'Error en el servidor',
        alertIcon: 'error',
        showConfirmButton: true,
        timer: false,
        ruta: '/'
      });
    } finally {
      pool.close();
    }
  } catch (error) {
    console.error(error);
    return res.render('Login', {
      alert: true,
      alertTitle: 'Error',
      alertMessage: 'Error en el servidor',
      alertIcon: 'error',
      showConfirmButton: true,
      timer: false,
      ruta: '/'
    });
  }
};

 export const logout = (req, res)=>{
  res.clearCookie('jwt')   
  return res.redirect('/')
}


export const isAuthenticated = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodificada = await promisify(jwt.verify)(req.cookies.jwt, config.JWT_SECRET);

      const pool = await getConnection();

      try {
        const result = await pool
          .request()
          .input('id', sql.Int, decodificada.id)
          .query('SELECT * FROM USUARIO WHERE IdUsuario = @id');

        if (result.recordset.length === 1) {
          req.user = result.recordset[0]; // Guarda la información del usuario en el objeto req
          return next(); // Usuario autenticado correctamente
        }
      } catch (error) {
        console.error('Error en la consulta SQL:', error);
        return res.status(500).json({ error: 'Error en el servidor' });
      }
    } catch (error) {
      console.log(error);
      return res.status(403).json({ error: 'Acceso denegado' });
    }
  } else {
    return res.redirect('/'); // Si no se encontró un token JWT en las cookies, redirige al usuario a la página de inicio de sesión
  }
  // No cierras la conexión aquí
};

export function checkAccess(resource, role) {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(403).send('Acceso denegado'); // Usuario no autenticado
      }

      const userId = req.user.IdUsuario;

      const pool = await getConnection();
      try {
        const result = await pool
          .request()
          .input('userId', sql.Int, userId)
          .input('resource', sql.NVarChar, resource)
          .input('role', sql.NVarChar, role) // Agregar el rol del usuario
          .query(
            'SELECT COUNT(*) AS accessCount ' +
            'FROM Permisos P ' +
            'INNER JOIN Roles R ON P.IdRol = R.IdRol ' +
            'INNER JOIN Recursos RS ON P.IdRecurso = RS.IdRecurso ' +
            'INNER JOIN USUARIO U ON U.IdRol = R.IdRol ' +
            'WHERE U.IdUsuario = @userId AND RS.NombreRecurso = @resource ' +
            'AND R.NombreRol = @role' // Comprobar el rol del usuario
          );

        const accessCount = result.recordset[0].accessCount;

        if (accessCount > 0) {
          // El usuario tiene acceso al recurso
          next();
        } else {
          // El usuario no tiene acceso al recurso
          res.status(403).send('Acceso denegado');
        }
      } catch (error) {
        console.error('Error en la consulta SQL:', error);
        res.status(500).send('Error en el servidor');
      } finally {
        pool.close();
      }
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      res.status(500).send('Error en el servidor');
    }
  };
}


