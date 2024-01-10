import * as UsuarioModel from '../models/ConsultaUsuario';
import bcrypt from 'bcryptjs';
export const renderUsuarioPage = async (req, res) => {
    try {
      
  // Obtén el usuario autenticado desde res.locals.userData
const user = res.locals.userData;

      res.render('MtlUsuarios.ejs', { pageTitle: 'Usuario',user } );
    } catch (error) {
      res.status(500).send(error.message);
    }
  };


  export const GetUsuarios = async (req, res) => {
    try {
      const Usuario = await UsuarioModel.mostrarUsuarios();
      res.json(Usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  export const RegistrarUsuario = async (req, res) => {
    try {
      const { Nombres, Apellidos, LoginUsuario, Contrasena, IdRol, Estado, UsuarioModificacion } = req.body;
  
      const userId = await UsuarioModel.registerUser(Nombres, Apellidos, LoginUsuario, Contrasena, IdRol, Estado, UsuarioModificacion);
  
      res.status(200).json({ message: 'Usuario registrado con éxito', userId });
    } catch (error) {
      console.error('Error en el registro de usuario:', error.message);
      res.status(500).json({ error: 'Error en el servidor', errorMessage: error.message });
    }
  };
  



  export const ActualizarUsuario = async (req, res) => {
    try {
      const { Nombres, Apellidos, LoginUsuario, IdRol, UsuarioModificacion } = req.body;
      const id = req.params.id;
  
      // Agrega un registro para imprimir los datos recibidos
      console.log('Datos recibidos:', { Nombres, Apellidos, LoginUsuario, IdRol, id });
  
      const result = await UsuarioModel.updateUser(parseInt(id, 10), Nombres, Apellidos, LoginUsuario, IdRol, UsuarioModificacion);
  
      // Verifica si la actualización fue exitosa
      if (result.status === 200) {
        console.log('La actualización fue exitosa');
        res.status(200).json({ mensaje: 'La actualización fue exitosa' });
      } else if (result.status === 304) {
        console.log('No se realizaron cambios en la base de datos');
        res.status(304).json({ mensaje: 'No se realizaron cambios en la base de datos' });
      } else {
        console.error('Error en la actualización. Estado:', result.status);
        res.status(result.status).json({ error: 'Error en la actualización' });
      }
    } catch (error) {
      console.error('Error en la actualización de usuario:', error.message);
      res.status(500).json({ error: 'Error en el servidor', errorMessage: error.message });
    }
  };
  
  
  export const ActualizarContrasenaUsuario = async (req, res) => {
    try {
      const {  Contrasena, UsuarioModificacion } = req.body;
      const codigo = req.params.id;
      const result = await UsuarioModel.actualizarContrasena(codigo, Contrasena, UsuarioModificacion);
  
      // Verifica el resultado y responde según sea necesario
    // Verifica si la actualización fue exitosa
    if (result.status === 200) {
      console.log('La actualización fue exitosa');
      res.status(200).json({ mensaje: 'La actualización fue exitosa' });
    } else if (result.status === 304) {
      console.log('No se realizaron cambios en la base de datos');
      res.status(304).json({ mensaje: 'No se realizaron cambios en la base de datos' });
    } else {
      console.error('Error en la actualización. Estado:', result.status);
      res.status(result.status).json({ error: 'Error en la actualización' });
    }
  
    } catch (error) {
      console.error('Error al actualizar contraseña:', error.message);
      res.status(500).json({ error: 'Error en el servidor', errorMessage: error.message });
    }
  };

  export const MostrarHistorialLoginUsuario = async (req, res) => {
    try {
        const loginUsuario = req.params.id;
        const result = await UsuarioModel.getHistorialUsuarioPorLogin(loginUsuario);

        res.json(result);

    } catch (error) {
        console.error('Error al mostrar el historial:', error.message);
        res.status(500).json({ error: 'Error en el servidor', errorMessage: error.message });
    }
};




  export const darDeBajaUsuario = async (req, res) => {
    const codigo = req.params.id;
  
    try {
      await UsuarioModel.darDeBajaUsuario(codigo);
      res.json({ message: 'Usuario dado de baja exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  export const activarUsuario = async (req, res) => {
    const codigo = req.params.id;
  
    try {
      await UsuarioModel.activarUsuario(codigo);
      res.json({ message: 'Usuario activado exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  