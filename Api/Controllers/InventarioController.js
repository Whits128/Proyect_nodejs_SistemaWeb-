

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



export const actualizarInventario = async (req, res) => {
  try {
      const { id } = req.params; // Extraer el ID de los parámetros de la ruta
      const { precioVenta, existenciasMinimas } = req.body;

      // Verificar si el ID es válido antes de intentar actualizar
      if (!id || isNaN(id)) {
          return res.status(400).json({ error: 'El ID proporcionado no es válido.' });
      }

      // Verificar si los valores recibidos no son nulos o están vacíos
      if (!precioVenta || !existenciasMinimas) {
          return res.status(400).json({ error: 'Los campos precioVenta y existenciasMinimas son obligatorios.' });
      }

      // Convertir los valores a números
      const precioVentaNum = parseFloat(precioVenta);
      const existenciasMinimasNum = parseInt(existenciasMinimas);

      // Verificar si los valores son numéricos válidos
      if (isNaN(precioVentaNum) || isNaN(existenciasMinimasNum)) {
          return res.status(400).json({ error: 'Los campos precioVenta y existenciasMinimas deben ser valores numéricos válidos.' });
      }

      // Actualizar el inventario
      await InvetarioModel.actualizarInventario(id, precioVentaNum, existenciasMinimasNum);

      // Responder con éxito
      res.status(200).json({ message: 'Inventario actualizado correctamente.' });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

