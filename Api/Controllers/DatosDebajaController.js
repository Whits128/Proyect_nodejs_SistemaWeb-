import * as DatosDebajaModel from '../models/DatosDebaja';

export const renderDatosDebajaPage = async (req, res) => {
    try {
    // Obtener las categorías inactivas utilizando la función separada
    const categoriasInactivas = await obtenerCategoriasInactivas();
    const BodegaInactivas = await obtenerBodegaInactivas();
      res.render('CtlDatosDebaja.ejs', { pageTitle: 'Datos dados de Baja',categoriasInactivas,BodegaInactivas });
    
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

// En algún otro archivo o función
export const obtenerCategoriasInactivas = async () => {
  try {
    const categoriasInactivas = await DatosDebajaModel.mostrarCategorias();
    return categoriasInactivas;
  } catch (error) {
    throw error;
  }
};



// Controlador para activar la categoría
export const activarCategoria = async (req, res) => {
  const codigo = req.body.codigo;

  try {
    // Realiza la acción para activar la categoría
    await DatosDebajaModel.activarCategoria(codigo);

    // Después de la acción, redirige a una nueva URL
    res.redirect('/api/DatosDebaja/page');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//Seccion de Bodega 

// En algún otro archivo o función
export const obtenerBodegaInactivas = async () => {
  try {
    const BodegaInactivas = await DatosDebajaModel.mostrarBodega();
    return BodegaInactivas;
  } catch (error) {
    throw error;
  }
};



// Controlador para activar la Bodega
export const activarBodega = async (req, res) => {
  const codigo = req.body.codigo;

  try {
    // Realiza la acción para activar la categoría
    await DatosDebajaModel.activarBodega(codigo);

    // Después de la acción, redirige a una nueva URL
    res.redirect('/api/DatosDebaja/page');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
