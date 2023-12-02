import * as UsuarioModel from '../models/ConsultaUsuario';

export const GetInicio = async (req, res) => {
  try {
        // Obtén el total de usuarios
        const totalUsuarios = await UsuarioModel.obtenerTotalUsuarios();
    res.render('Inicio.ejs', { pageTitle: 'Inicio', totalUsuarios });

  } catch (error) {
    res.status(500);
  }
};
