import * as ProductoModel from '../models/ProductoZapatos';

export const renderProductosPage = async (req, res) => {
  try {
    res.render('CtlProducto.ejs', { pageTitle: 'Productos' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await ProductoModel.mostrarProductos();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addProduct = async (req, res) => {
  const { nombre, descripcion, idCategoria, estado } = req.body;

  try {
    const existingProducts = await ProductoModel.mostrarProductos();
    const productExists = existingProducts.some(
      (product) => product.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (productExists) {
      return res.status(400).json({
        error: 'Ya existe un producto con este nombre. Por favor, elige otro nombre.'
      });
    }

    const codigo = await ProductoModel.agregarProducto(nombre, descripcion, idCategoria, estado);
    res.status(201).json({ codigo, message: 'Producto agregado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateProduct = async (req, res) => {
  const { nombre, descripcion, idCategoria, estado } = req.body;
  const { id } = req.params;

  try {
   
    const existingProducts = await ProductoModel.mostrarProductos();
    const productExistente = existingProducts.find((b) => b.Codigo === parseInt(id, 10));
    if (!productExistente) {
      return res.status(404).json({ error: 'No se encontró el producto con el ID proporcionado.' });
    }

    
    const productDuplicado = existingProducts.some(
      (b) => b.Codigo !== parseInt(id, 10) && b.Nombre.toLowerCase() === nombre.toLowerCase()
    );
    if (productDuplicado) {
      return res.status(400).json({ error: 'Ya existe un producto con este nombre. Por favor, elige otro nombre.' });
    }

    await ProductoModel.actualizarProducto(parseInt(id, 10), nombre, descripcion, idCategoria, estado);
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const darDeBajaProducto = async (req, res) => {
  const codigo = req.params.id;

  try {
    await ProductoModel.darDeBajaProducto(codigo);
    res.json({ message: 'Producto dado de baja exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const activateProduct = async (req, res) => {
  const codigo = req.params.id;

  try {
    await ProductoModel.activarProducto(codigo);
    res.json({ message: 'Producto activado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
