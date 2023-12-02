import * as ColorModel from '../models/ConsultaColores';
import * as UsuarioModel from '../models/ConsultaUsuario';
export const renderColorPage = async (req, res) => {
  try {
  
    res.render('CtlColores.ejs', { pageTitle: 'Colores'});
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const GetColor = async (req, res) => {
  try {
    const colores = await ColorModel.mostrarColores();
    res.json(colores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const guardarColor = async (req, res) => {
  const { color, estado } = req.body;

  try {
    const colores = await ColorModel.mostrarColores();
    
    // Agregar comprobación de existencia antes de acceder a propiedades
    const colorExistente = colores.find(
      (c) => c && c.Color && c.Color.toLowerCase() === color.toLowerCase()
    );

    if (colorExistente) {
      return res.status(400).json({ error: 'Ya existe un color con este nombre. Por favor, elige otro nombre.' });
    }

    const codigo = await ColorModel.guardarColor(color, estado);
    res.status(201).json({ codigo, message: 'Color creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const updateColor = async (req, res) => {
  const { color, estado } = req.body;
  const { id } = req.params; // Extraer el ID de los parámetros de la ruta

  try {
    const colores = await ColorModel.mostrarColores();
    const colorExistente = colores.find((c) => c.Codigo === parseInt(id, 10));

    if (!colorExistente) {
      return res.status(404).json({ error: 'No se encontró el color con el ID proporcionado.' });
    }

    const colorDuplicado = colores.some(
      (c) => c.Codigo !== parseInt(id, 10) && c.Color.toLowerCase() === color.toLowerCase()
    );

    if (colorDuplicado) {
      return res.status(400).json({ error: 'Ya existe un color con este nombre. Por favor, elige otro nombre.' });
    }

    await ColorModel.actualizarColor(parseInt(id, 10), color, estado);
    res.json({ message: 'Color actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const darDeBajaColor = async (req, res) => {
  const codigo = req.params.id;

  try {
    await ColorModel.darDeBajaColor(codigo);
    res.json({ message: 'Color dado de baja exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const activarColor = async (req, res) => {
  const codigo = req.params.id;

  try {
    await ColorModel.activarColor(codigo);
    res.json({ message: 'Color activado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
