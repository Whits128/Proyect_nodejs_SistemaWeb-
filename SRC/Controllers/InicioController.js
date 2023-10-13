export const Inicios = async (req, res) => {
    try {
      res.render('Inicio.ejs');
    } catch (error) {
      res.status(500).send('Error al renderizar la vista');
    }
  };