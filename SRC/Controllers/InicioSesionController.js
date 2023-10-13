
import { getConnection, sql } from "../database";
import jsonwebtoken from "jsonwebtoken";
const bcryptjs = require('bcryptjs');
import config from "../config";




export const registerUser = async (req, res) => {
  try {
    const { Nombres, Apellidos, IdRol, LoginUsuario, LoginClave } = req.body;

    // Hash de la contraseña
    const hashedPassword = await bcryptjs.hash(LoginClave, 10);

    const pool = await getConnection();

    // Insertar el usuario en la base de datos
    await pool.request()
      .input('Nombres', sql.VarChar, Nombres)
      .input('Apellidos', sql.VarChar, Apellidos)
      .input('IdRol', sql.Int, IdRol)
      .input('LoginUsuario', sql.VarChar, LoginUsuario)
      .input('LoginClave', sql.VarChar, hashedPassword)
      .query('INSERT INTO USUARIO (Nombres, Apellidos, IdRol, LoginUsuario, LoginClave) VALUES (@Nombres, @Apellidos, @IdRol, @LoginUsuario, @LoginClave)');

    pool.close();

    // Redirigir o responder con un mensaje de éxito
    return res.redirect('/');
  } catch (error) {
    console.error('Error en el registro de usuario:', error);
    return res.status(500).send('Error en el servidor');
  }
};

export const Login = async (req, res) => {
  try {
    const { user, password } = req.body;

    if (!user || !password) {
      return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
    }

    const pool = await getConnection();

    try {
      const result = await pool.request()
        .input('user', sql.VarChar, user)
        .query('SELECT * FROM USUARIO WHERE LoginUsuario = @user');

      if (result.recordset.length === 0) {
        return res.status(400).send({ status: "Error", message: "Usuario no encontrado" });
      }

      const storedPassword = result.recordset[0].LoginClave;
      const loginCorrecto = await bcryptjs.compare(password, storedPassword);

      if (!loginCorrecto) {
        return res.status(400).send({ status: "Error", message: "Credenciales incorrectas" });
      }
      console.log('Valor de JWT_SECRETO:',  config);
      const token = jsonwebtoken.sign(
        { user: user },
       config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN}
      );
      

      const cookieOption = {
        expires: new Date(Date.now() +config.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: "/"
      }
      res.cookie("jwt", token, cookieOption);
      res.send({ status: "ok", message: "Usuario loggeado", redirect: "/admin" });
    } catch (error) {
      console.error('Error en la consulta SQL:', error);
      return res.status(500).send({ status: "Error", message: "Error en el servidor" });
    } finally {
      pool.close();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ status: "Error", message: "Error en el servidor" });
  }
};




