import * as categoriaModel from '../models/ConsultaCategoria';

export const renderCategoriasPage = async (req, res) => {
  try {
    
   

    res.render('CtlCagoria.ejs', { pageTitle: 'Categorias'});
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const GetCategorias = async (req, res) => {
  try {
    const categorias = await categoriaModel.mostrarCategorias();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const guardarCategoria = async (req, res) => {
  const { nombre, estado } = req.body;

  try {
    const categorias = await categoriaModel.mostrarCategorias();
    const categoriaExistente = categorias.find(
      (c) => c.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (categoriaExistente) {
      return res.status(400).json({ error: 'Ya existe una categoría con este nombre. Por favor, elige otro nombre.' });
    }

    const codigo = await categoriaModel.guardarCategoria(nombre, estado);
    res.status(201).json({ codigo, message: 'Categoría creada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateCategoria = async (req, res) => {
  const { nombre, estado } = req.body;
  const { id } = req.params; // Extraer el ID de los parámetros de la ruta

  try {
    const categorias = await categoriaModel.mostrarCategorias();
    const categoriaExistente = categorias.find((c) => c.Codigo === parseInt(id, 10));

    if (!categoriaExistente) {
      return res.status(404).json({ error: 'No se encontró la categoría con el ID proporcionado.' });
    }

    const categoriaDuplicada = categorias.some(
      (c) => c.Codigo !== parseInt(id, 10) && c.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (categoriaDuplicada) {
      return res.status(400).json({ error: 'Ya existe una categoría con este nombre. Por favor, elige otro nombre.' });
    }

    await categoriaModel.updateCategoria(parseInt(id, 10), nombre, estado);
    res.json({ message: 'Categoría actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const darDeBajaCategoria = async (req, res) => {
  const codigo = req.params.id;

  try {
    await categoriaModel.darDeBajaCategoria(codigo);
    res.json({ message: 'Categoría dada de baja exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const activarCategoria = async (req, res) => {
  const codigo = req.params.id;

  try {
    await categoriaModel.activarCategoria(codigo);
    res.json({ message: 'Categoría activada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
