import * as UsuarioModel from '../models/ConsultaUsuario';
import bcrypt from 'bcryptjs';
export const renderUsuarioPage = async (req, res) => {
    try {
      
  
      res.render('MtlUsuarios.ejs', { pageTitle: 'Usuario' } );
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



  export const  RegistrarUsuario = async (req, res) => {
    try {
      const { Nombres, Apellidos, LoginUsuario, LoginClave, IdRol, Estado } = req.body;
  
      const userId = await UsuarioModel.registerUser(Nombres, Apellidos, LoginUsuario, LoginClave, IdRol, Estado);
  
      res.status(200).json({ message: 'Usuario registrado con éxito', userId });
    } catch (error) {
      console.error('Error en el registro de usuario:', error.message);
      res.status(500).json({ error: 'Error en el servidor', errorMessage: error.message });
    }
  };




  export const ActualizarUsuario = async (req, res) => {
    try {
      const { Nombres, Apellidos, LoginUsuario, IdRol } = req.body;
      const id = req.params.id;

 // Agrega un registro para imprimir los datos recibidos
 console.log('Datos recibidos:', { Nombres, Apellidos, LoginUsuario, IdRol, id });

      const success = await UsuarioModel.updateUser(parseInt(id, 10),  Nombres, Apellidos, LoginUsuario, IdRol );
  
      if (success) {
        res.status(200).json({ message: 'Usuario actualizado con éxito' });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error en la actualización de usuario:', error.message);
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
  