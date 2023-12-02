import * as PromocionesModel from '../models/ConsutalPromociones';

import * as UsuarioModel from '../models/ConsultaUsuario';
export const renderPromocionesPage = async (req, res) => {
  try {
    const usuarioAutenticado = req.user.LoginUsuario;
    const detallesUsuario = await UsuarioModel.obtenerNombreUsuarioYRol(usuarioAutenticado);

    res.render('CtlPromociones.ejs', { pageTitle: 'Promociones', user: detallesUsuario });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const GetPromociones = async (req, res) => {
  try {
    const promociones = await PromocionesModel.mostrarPromociones();
    res.json(promociones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const guardarPromociones = async (req, res) => {
  const { nombre, descripcion, fechaInicio, fechaFin, estado } = req.body;

  try {
    const promociones = await PromocionesModel.mostrarPromociones();
    const promocionExistente = promociones.find(
      (promocion) => promocion.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (promocionExistente) {
      return res.status(400).json({ error: 'Ya existe una promoción con este nombre. Por favor, elige otro nombre.' });
    }

    const codigo = await PromocionesModel.guardarPromocion(nombre, descripcion, fechaInicio, fechaFin, estado);
    res.status(201).json({ codigo, message: 'Promoción creada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updatePromociones = async (req, res) => {
  const { nombre, descripcion, fechaInicio, fechaFin, estado } = req.body;
  const { id } = req.params; // Extraer el ID de los parámetros de la ruta

  try {
    const promociones = await PromocionesModel.mostrarPromociones();
    const promocionExistente = promociones.find((promocion) => promocion.Codigo === parseInt(id, 10));

    if (!promocionExistente) {
      return res.status(404).json({ error: 'No se encontró la promoción con el ID proporcionado.' });
    }

    const nombreDuplicado = promociones.some(
      (promocion) => promocion.Codigo !== parseInt(id, 10) && promocion.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (nombreDuplicado) {
      return res.status(400).json({ error: 'Ya existe una promoción con este nombre. Por favor, elige otro nombre.' });
    }

    await PromocionesModel.actualizarPromocion(parseInt(id, 10), nombre, descripcion, fechaInicio, fechaFin, estado);
    res.json({ message: 'Promoción actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const darDeBajaPromociones = async (req, res) => {
  const codigo = req.params.id;

  try {
    await PromocionesModel.darDeBajaPromocion(codigo);
    res.json({ message: 'Promoción dada de baja exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const activarPromociones = async (req, res) => {
  const codigo = req.params.id;

  try {
    await PromocionesModel.activarPromocion(codigo);
    res.json({ message: 'Promoción activada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
