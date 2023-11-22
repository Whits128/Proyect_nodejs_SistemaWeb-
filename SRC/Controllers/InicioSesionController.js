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
        res.json({ msg: "Size deactivated successfully" });
      }
    } catch (error) {
      console.log(error);
      res.json({ msg: "Size deactivated successfully" });
    }
  } else {
    return res.redirect('/'); // Si no se encontró un token JWT en las cookies, redirige al usuario a la página de inicio de sesión
  }
  // No cierras la conexión aquí
};

export const checkAccess = async (req, res, next) => {
  let pool;
  try {
    // Verifica si el usuario está autenticado
    if (!req.user) {
      return res.status(403).json({ error: 'Acceso denegado. Usuario no autenticado' });
    }

    // Obtiene la ruta actual
    const currentPath = req.path.toLowerCase();

    // Consulta la configuración de acceso desde la base de datos
    const routeConfig = await getRouteConfig(currentPath);

    if (!routeConfig) {
      return res.status(403).json({ error: 'Ruta no encontrada' });
    }

    const { IdRecurso, IdRol } = routeConfig;
    const userId = req.user.IdUsuario;

    // Verifica si el usuario tiene acceso al recurso
    const hasAccess = await hasUserAccess(userId, IdRecurso, IdRol);

    if (hasAccess) {
      next(); // El usuario tiene acceso al recurso
    } else {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
  } catch (error) {
    console.error('Error en el middleware de autorización:', error);

    // Maneja el error y envía una respuesta adecuada
    return res.status(500).json({ error: 'Error en el servidor' });
  } finally {
    // Cierra la conexión de la base de datos en caso de que se haya abierto
    if (pool) {
      await pool.close();
    }
  }
};

// Función para obtener la configuración de ruta desde la base de datos
const getRouteConfig = async (ruta) => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool
      .request()
      .input('ruta', sql.NVarChar, ruta)
      .query('SELECT TOP 1 IdRecurso, IdRol FROM ConfiguracionAcceso WHERE Ruta = @ruta');

    return result.recordset[0];
  } catch (error) {
    console.error('Error al obtener la configuración de ruta:', error);
    throw error;
  } finally {
    // Cierra la conexión de la base de datos en caso de que se haya abierto
    if (pool) {
      await pool.close();
    }
  }
};

// Función para verificar el acceso del usuario en la base de datos
const hasUserAccess = async (userId, IdRecurso, IdRol) => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool
      .request()
      .input('userId', sql.Int, userId)
      .input('IdRecurso', sql.Int, IdRecurso)
      .input('IdRol', sql.Int, IdRol)
      .query('SELECT COUNT(*) AS accessCount FROM ConfiguracionAcceso WHERE IdRol = @IdRol AND IdRecurso = @IdRecurso');

    return result.recordset[0].accessCount > 0;
  } catch (error) {
    console.error('Error al verificar el acceso del usuario:', error);
    throw error;
  } finally {
    // Cierra la conexión de la base de datos en caso de que se haya abierto
    if (pool) {
      await pool.close();
    }
  }
};
