
export const layouts = async (req, res) => {
  try {
    // Renderiza la vista layout.ejs y pasa la variable 'body' que debe incluir el contenido específico de la página
    res.render('layout.ejs', { body: 'Contenido del cuerpo de la página' });
  } catch (error) {
    res.status(500).send('Error al renderizar la vista');
  }
};





