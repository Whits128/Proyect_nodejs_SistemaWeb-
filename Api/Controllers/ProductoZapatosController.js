import * as ProductoModel from '../models/ProductoZapatos'; // Asegúrate de tener el nombre correcto del archivo del modelo
import Joi from 'joi';

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
    // Validación de existencia de producto
    const existingProducts = await ProductoModel.mostrarProductos();
    const productExists = existingProducts.some(
      (product) => product.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (productExists) {
      const messages = {
        error: 'Ya existe un producto con este nombre. Por favor, elige otro nombre.',
      };
      return res.render('productPage.ejs', { messages });
    }

    // Validación de datos con Joi
    const schema = Joi.object({
      nombre: Joi.string().required().messages({
        'any.required': 'El nombre es obligatorio.',
        'string.empty': 'El nombre no puede estar vacío.',
      }),
      descripcion: Joi.string().required().messages({
        'any.required': 'La descripción es obligatoria.',
        'string.empty': 'La descripción no puede estar vacía.',
      }),
      idCategoria: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID de la categoría es obligatorio.',
        'number.base': 'El ID de la categoría debe ser un número.',
        'number.integer': 'El ID de la categoría debe ser un número entero.',
        'number.positive': 'El ID de la categoría debe ser un número positivo.',
      }),
      estado: Joi.string().required().valid('Activo', 'Inactivo').messages({
        'any.required': 'El estado es obligatorio.',
        'any.only': 'El estado debe ser "Activo" o "Inactivo".',
      }),
    });

    const validationResult = schema.validate({ nombre, descripcion, idCategoria, estado });

    if (validationResult.error) {
      const messages = {
        error: validationResult.error.details[0].message,
      };
      return res.render('productPage.ejs', { messages });
    }

    // Llamada a la función del modelo para agregar el producto
    await ProductoModel.agregarProducto(nombre, descripcion, idCategoria, estado);

    const messages = {
      success: 'Producto agregado exitosamente.',
    };

    // Renderizar la vista con mensajes de éxito
    res.render('productPage.ejs', { messages });
  } catch (error) {
    console.error(error);

    const messages = {
      error: 'Error interno del servidor.',
    };

    // Renderizar la vista con mensajes de error
    res.status(500).render('productPage.ejs', { messages });
  }
};

export const updateProduct = async (req, res) => {
  const { nombre, descripcion, idCategoria, estado } = req.body;
  const { id } = req.params; // Extraer el ID de los parámetros de la ruta

  try {
    // Validación de existencia de producto
    const existingProducts = await ProductoModel.mostrarProductos();
    const productExists = existingProducts.find((product) => product.ID_Producto === parseInt(id, 10));

    if (!productExists) {
      return res.status(404).json({ error: 'No se encontró el producto con el ID proporcionado.' });
    }

    // Validación de datos con Joi
    const schema = Joi.object({
      nombre: Joi.string().required().messages({
        'any.required': 'El nombre es obligatorio.',
        'string.empty': 'El nombre no puede estar vacío.',
      }),
      descripcion: Joi.string().required().messages({
        'any.required': 'La descripción es obligatoria.',
        'string.empty': 'La descripción no puede estar vacía.',
      }),
      idCategoria: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID de la categoría es obligatorio.',
        'number.base': 'El ID de la categoría debe ser un número.',
        'number.integer': 'El ID de la categoría debe ser un número entero.',
        'number.positive': 'El ID de la categoría debe ser un número positivo.',
      }),
      estado: Joi.string().required().valid('Activo', 'Inactivo').messages({
        'any.required': 'El estado es obligatorio.',
        'any.only': 'El estado debe ser "Activo" o "Inactivo".',
      }),
    });

    const validationResult = schema.validate({ nombre, descripcion, idCategoria, estado });

    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.details[0].message });
    }

    // Llamada a la función del modelo para actualizar el producto
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
      res.json({ message: 'Marca dada de baja exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
export const activateProduct = async (req, res) => {
  const { id } = req.params; // Extraer el ID de los parámetros de la ruta

  try {
    // Llamada a la función del modelo para activar el producto
    await ProductoModel.activarProducto(parseInt(id, 10));

    res.json({ message: 'Producto activado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
