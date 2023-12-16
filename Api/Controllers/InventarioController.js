

import * as InvetarioModel from '../models/ConsultaInvetario';
export const renderInventarioPage = async (req, res) => {
  try {

    res.render('MtInventario.ejs', { pageTitle: 'Inventario' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const GetInventario = async (req, res) => {
  try {
    const inventario = await InvetarioModel.mostrarInventario();
    res.json(inventario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}; 



export const agregarProducto = async (req, res) => {
    try {
      // Obtener los datos del formulario enviado por el cliente
      const {
        idBodega,
        idProducto,
        idMarca,
        idTalla,
        idColores,
        idMaterial,
        estado
      } = req.body;
  
      // Crear un objeto con los datos del producto
      const producto = {
        idBodega,
        idProducto,
        idMarca,
        idTalla,
        idColores,
        idMaterial,
        estado
      };
  
      // Agregar el producto al inventario
      await InvetarioModel.agregarProductoAlInventario(producto);
      console.log('Datos recibidos en el servidor:', req.body);
    
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Agrega la función de actualización en tu controlador
export const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params; // Extraer el ID de los parámetros de la ruta
      // Obtén los datos del formulario enviado por el cliente
      const {
     
        idBodega,
        idProducto,
        idMarca,
        idTalla,
        idColores,
        idMaterial,
        estado
      } = req.body;
  
      // Crear un objeto con los datos del producto
      const producto = {
        idBodega: parseInt(idBodega),
        idProducto: parseInt(idProducto),
        idMarca: parseInt(idMarca),
        idTalla: parseInt(idTalla),
        idColores: parseInt(idColores),
        idMaterial: parseInt(idMaterial),
        estado
      };
  
      // Actualiza el producto en el inventario
      await InvetarioModel.actualizarInventario(id, producto);
  
      res.json({ success: true, message: 'Producto actualizado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };