import { getConnection, sql } from '../models/connection';
import bcrypt from 'bcryptjs';
import config from '../../Config/config';
import jwt from 'jsonwebtoken';
import { createToken,verifyToken} from '../Middleware/MiddlewareJWT';


export const registerUser = async (req, res) => {
  try {
    const { Nombres, Apellidos, IdRol, LoginUsuario, LoginClave, Estado } = req.body;
    const hashedPassword = await bcrypt.hash(LoginClave, 10);
    const pool = await getConnection();

    await pool
      .request()
      .input('Nombres', sql.VarChar, Nombres)
      .input('Apellidos', sql.VarChar, Apellidos)
      .input('LoginUsuario', sql.VarChar, LoginUsuario)
      .input('LoginClave', sql.VarChar, hashedPassword)
      .input('IdRol', sql.Int, IdRol)
      .input('Estado', sql.VarChar, Estado)
      .query(
        'INSERT INTO USUARIO (Nombres, Apellidos, LoginUsuario, LoginClave, IdRol, Estado) VALUES (@Nombres, @Apellidos, @LoginUsuario, @LoginClave, @IdRol, @Estado)'
      );

    // Después de registrar el usuario, obtenemos su información
    const user = {
      loginUser: LoginUsuario,
      IdRol: IdRol, // Ajusta esto según tu estructura de base de datos
      
      // Otros campos del usuario que desees incluir en el token
    };

    // Creamos el token usando el middleware
    const token = await createToken(user);

   
    // Cerramos la conexión al pool de SQL
    pool.close();

    // Enviamos el token como respuesta
    res.send({user,token});
  } catch (error) {
    console.error('Error en el registro de usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
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
          const id = result.recordset[0].IdUsuario;
  const loginUser  = result.recordset[0].LoginUsuario;
  const idrol  = result.recordset[0].IdRol;
          // Crear un token con la información del usuario
          const token = await createToken({id:id, user:loginUser,rol:idrol  /* Otros datos del usuario si es necesario */ });
    
        
          // Configuración de la cookie JWT
          const cookieOptions = {
            expires: new Date(Date.now() + config.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            path: "/"
          };
          res.cookie('jwt', token, cookieOptions);
  
          // Incrementar el contador de sesiones y registrar la fecha de inicio de sesión
          const updatedResult = await pool
            .request()
            .input('idUsuario', sql.Int, result.recordset[0].IdUsuario)
            .query(`
              UPDATE USUARIO
              SET NumSesiones = NumSesiones + 1,
                  FechaInicioSesion = GETDATE()
              WHERE IdUsuario = @idUsuario
            `);
  
          return res.redirect('/Inicio'); // Redireccionar a '/Inicio' en caso de inicio de sesión exitoso
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
  

export const logout = async (req, res) => {
  try {
    const usuario = req.user;

    if (!usuario) {
      return res.redirect('/');
    }

    // Registrar la fecha de cierre de sesión
    const pool = await getConnection();
    try {
      const result = await pool
        .request()
        .input('idUsuario', usuario.IdUsuario)
        .query(`
          UPDATE USUARIO
          SET FechaFinSesion = GETDATE()
          WHERE IdUsuario = @idUsuario
        `);
    } catch (error) {
      console.error('Error al actualizar la fecha de cierre de sesión:', error.message);
    } finally {
      pool.close();
    }

    res.clearCookie('jwt');
    return res.redirect('/');
  } catch (error) {
    console.error('Error en la función logout:', error.message);
    res.redirect('/');
  }
};
