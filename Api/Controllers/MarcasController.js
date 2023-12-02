import * as MarcaModel from '../models/CondultaMarcas';

import * as UsuarioModel from '../models/ConsultaUsuario';
export const renderMarcapage = async (req, res) => {
  try {

    res.render('CtlMarcas.ejs', { pageTitle: 'Marcas' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const GetMarcas = async (req, res) => {
  try {
    const Marcas = await MarcaModel.mostrarMarcas();
    res.json(Marcas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const guardarMarca = async (req, res) => {
  const { nombre, detalleMarca, estado } = req.body;

  try {
    const marcas = await MarcaModel.mostrarMarcas();
    const marcaExistente = marcas.find(
      (marca) => marca.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (marcaExistente) {
      return res.status(400).json({ error: 'Ya existe una marca con este nombre. Por favor, elige otro nombre.' });
    }

    const codigo = await MarcaModel.guardarMarca(nombre, detalleMarca, estado);
    res.status(201).json({ codigo, message: 'Marca creada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateMarca = async (req, res) => {
  const { nombre, detalleMarca, estado } = req.body;
  const { id } = req.params; // Extraer el ID de los parámetros de la ruta

  try {
    const marcas = await MarcaModel.mostrarMarcas();
    const marcaExistente = marcas.find((marca) => marca.Codigo === parseInt(id, 10));

    if (!marcaExistente) {
      return res.status(404).json({ error: 'No se encontró la marca con el ID proporcionado.' });
    }

    const nombreDuplicado = marcas.some(
      (marca) => marca.Codigo !== parseInt(id, 10) && marca.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (nombreDuplicado) {
      return res.status(400).json({ error: 'Ya existe una marca con este nombre. Por favor, elige otro nombre.' });
    }

    await MarcaModel.actualizarMarca(parseInt(id, 10), nombre, detalleMarca, estado);
    res.json({ message: 'Marca actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const darDeBajaMarca = async (req, res) => {
  const codigo = req.params.id;

  try {
    await MarcaModel.darDeBajaMarca(codigo);
    res.json({ message: 'Marca dada de baja exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const activarMarca = async (req, res) => {
  const codigo = req.params.id;

  try {
    await MarcaModel.activarMarca(codigo);
    res.json({ message: 'Marca activada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
