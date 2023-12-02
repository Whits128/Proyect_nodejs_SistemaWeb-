import * as MaterialesZapatosModel from '../models/ConsultamaterialesZapatos';

import * as UsuarioModel from '../models/ConsultaUsuario';
export const renderMzapatosPage = async (req, res) => {
  try {
    const usuarioAutenticado = req.user.LoginUsuario;
    const detallesUsuario = await UsuarioModel.obtenerNombreUsuarioYRol(usuarioAutenticado);

    res.render('CtlMaterialesZapatos.ejs', { pageTitle: 'Materiales Zapatos', user: detallesUsuario });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const GetMaterialesZapato = async (req, res) => {
  try {
    const materialesZapatos = await MaterialesZapatosModel.mostrarMaterialesZapatos();
    res.json(materialesZapatos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const guardarMaterialesZapato = async (req, res) => {
  const { nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado } = req.body;

  try {
    const materialesZapatos = await MaterialesZapatosModel.mostrarMaterialesZapatos();
    const materialZapatoExistente = materialesZapatos.find(
      (material) => material.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (materialZapatoExistente) {
      return res.status(400).json({ error: 'Ya existe un material de zapato con este nombre. Por favor, elige otro nombre.' });
    }

    const codigo = await MaterialesZapatosModel.guardarMaterialZapatos(nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado);
    res.status(201).json({ codigo, message: 'Material de zapatos creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateMaterialesZapato = async (req, res) => {
  const { nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado } = req.body;
  const { id } = req.params; // Extraer el ID de los parámetros de la ruta

  try {
    const materialesZapatos = await MaterialesZapatosModel.mostrarMaterialesZapatos();
    const materialZapatoExistente = materialesZapatos.find((material) => material.Codigo === parseInt(id, 10));

    if (!materialZapatoExistente) {
      return res.status(404).json({ error: 'No se encontró el material de zapato con el ID proporcionado.' });
    }

    const nombreDuplicado = materialesZapatos.some(
      (material) => material.Codigo !== parseInt(id, 10) && material.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (nombreDuplicado) {
      return res.status(400).json({ error: 'Ya existe un material de zapato con este nombre. Por favor, elige otro nombre.' });
    }

    await MaterialesZapatosModel.actualizarMaterialZapatos(parseInt(id, 10), nombre, descripcion, tipoMaterial, tipodeCostura, tipoSuela, fabricante, observaciones, estado);
    res.json({ message: 'Material de zapatos actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const darDeBajaMaterialesZapato = async (req, res) => {
  const codigo = req.params.id;

  try {
    await MaterialesZapatosModel.darDeBajaMaterialZapatos(codigo);
    res.json({ message: 'Material de zapato dada de baja exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const activarMaterialesZapato = async (req, res) => {
  const codigo = req.params.id;

  try {
    await MaterialesZapatosModel.activarMaterialZapatos(codigo);
    res.json({ message: 'Material de zapatos activada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
