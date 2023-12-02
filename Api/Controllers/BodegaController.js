import * as BodegaModel from '../models/ConsultaBodega';

import * as UsuarioModel from '../models/ConsultaUsuario';
export const renderBodegaPage = async (req, res) => {
  try {
    const usuarioAutenticado = req.user.LoginUsuario;
    const detallesUsuario = await UsuarioModel.obtenerNombreUsuarioYRol(usuarioAutenticado);

    res.render('CtlBodega.ejs', { pageTitle: 'Bodega', user: detallesUsuario });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const GetBodega = async (req, res) => {
  try {
    const bodegas = await BodegaModel.mostrarBodegas();
    res.json(bodegas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const guardarBodega = async (req, res) => {
  const { nombre, ubicacion, estado } = req.body;

  try {
    const bodegas = await BodegaModel.mostrarBodegas();
    const bodegaExistente = bodegas.find(
      (b) => b.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (bodegaExistente) {
      return res.status(400).json({ error: 'Ya existe una bodega con este nombre. Por favor, elige otro nombre.' });
    }

    const codigo = await BodegaModel.guardarBodega(nombre, ubicacion, estado);
    res.status(201).json({ codigo, message: 'Bodega creada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateBodega = async (req, res) => {
  const { nombre, ubicacion, estado } = req.body;
  const { id } = req.params; // Extraer el ID de los parámetros de la ruta

  try {
    const bodegas = await BodegaModel.mostrarBodegas();
    const bodegaExistente = bodegas.find((b) => b.Codigo === parseInt(id, 10));

    if (!bodegaExistente) {
      return res.status(404).json({ error: 'No se encontró la bodega con el ID proporcionado.' });
    }

    const bodegaDuplicada = bodegas.some(
      (b) => b.Codigo !== parseInt(id, 10) && b.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (bodegaDuplicada) {
      return res.status(400).json({ error: 'Ya existe una bodega con este nombre. Por favor, elige otro nombre.' });
    }

    await BodegaModel.actualizarBodega(parseInt(id, 10), nombre, ubicacion, estado);
    res.json({ message: 'Bodega actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const darDeBajaBodega = async (req, res) => {
  const codigo = req.params.id;

  try {
    await BodegaModel.darDeBajaBodega(codigo);
    res.json({ message: 'Bodega dada de baja exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const activarBodega = async (req, res) => {
  const codigo = req.params.id;

  try {
    await BodegaModel.activarBodega(codigo);
    res.json({ message: 'Bodega activada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
