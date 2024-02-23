import * as InformesModel from '../models/ConsultaInforme';
export const renderInformes = async (req, res) => {
    try {

      res.render('MtlInformes.ejs', { pageTitle: 'Informes' });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  export const GetInformeInventario = async (req, res) => {
    try {
      const Informes = await InformesModel.mostrarInventarioCantidadProducto();
      res.json(Informes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
}