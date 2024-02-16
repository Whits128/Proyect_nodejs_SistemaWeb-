import * as DatosDebajaModel from '../models/DatosDebaja';

export const renderDatosDebajaPage = async (req, res) => {
    try {
    // Obtener las categorías inactivas utilizando la función separada
    const categoriasInactivas = await obtenerCategoriasInactivas();
    const BodegaInactivas = await obtenerBodegaInactivas();
    const ProductosInactivos = await obtenerProductosInactivos();
    const ProveedoresInactivos = await obtenerProveedoresInactivos();
    const ColoresInactivos = await obtenerColoresInactivos();
    const PromocionesInactivas = await obtenerPromocionesInactivas();
    const TallasInactivas = await obtenerTallasInactivas();
      res.render('CtlDatosDebaja.ejs', { pageTitle: 'Datos dados de Baja',categoriasInactivas,BodegaInactivas,ProductosInactivos,ProveedoresInactivos,ColoresInactivos,PromocionesInactivas, TallasInactivas });
    
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


//seccion de Producto
//En algun otro archivo o funcion 
export const obtenerProductosInactivos = async () => {
  try {
    const ProductosInactivos = await DatosDebajaModel.mostrarProductos();
    return ProductosInactivos;
  } catch (error) {
    throw error;
  }
};

//Controlador para Activar los Productos

export const activarProductoZapatos = async (req, res) => {
  const codigo = req.body.codigo;

  try {
    // Realiza la accion para activar los productos
    await DatosDebajaModel.activarProductoZapatos(codigo);
    //Después de la acción, Redirige a una nueva URL
    res.redirect('/api/DatosDebaja/page');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error'});
  }
};


// Función para obtener proveedores inactivos
export const obtenerProveedoresInactivos = async () => {
  try {
    const proveedoresInactivos = await DatosDebajaModel.mostrarProveedoresInactivos(); 
    return proveedoresInactivos;
  } catch (error) {
    throw error;
  }
};

// Controlador para activar proveedor
export const activarProveedor = async (req, res) => {
  const codigo = req.body.codigo;

  try {
    await DatosDebajaModel.activarProveedor(codigo); // Asegúrate de tener esta función en el modelo
    res.redirect('/api/DatosDebaja/page');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Funcion para Obtener Colores Inactivos

export const obtenerColoresInactivos = async () => {
  try {
    const ColoresInactivos = await DatosDebajaModel.mostrarColoresInactivos(); 
    return ColoresInactivos;
  } catch (error) {
    throw error;
  }
};

// Controlador para activar Colores
export const activarColores = async (req, res) => {
  const codigo = req.body.codigo;

  try {
    await DatosDebajaModel.activarColores(codigo); // Asegúrate de tener esta función en el modelo
    res.redirect('/api/DatosDebaja/page');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//Funcion para Obtener promociones Inactivas

export const obtenerPromocionesInactivas = async () => {
  try {
    const PromocionesInactivas = await DatosDebajaModel.mostrarPromocionesInactivas();
    return PromocionesInactivas;
  } catch (error) {
    throw error;
  }
};

//Controaldor para Activar Promociones

export const activarPromociones = async (req, res) => {
  const codigo = req.body.codigo;

  try{
    await DatosDebajaModel.activarPromociones(codigo);
    res.redirect('/api/DatosDebaja/page');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
//tallas
export const obtenerTallasInactivas = async () => {
  try{
    const TallasInactivas = await DatosDebajaModel.mostrarTallasInactivas();
    return TallasInactivas;
  } catch (error) {
    throw error;
  }
};

export const activarTalla = async (req, res) => {
  const codigo = req.body.codigo;

  try {
    await DatosDebajaModel.activarTalla(codigo);
    res.redirect('/api/DatosDebaja/page');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error'});
  }
};