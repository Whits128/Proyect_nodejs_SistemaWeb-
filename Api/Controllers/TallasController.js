import * as TallasModel from '../models/ConsultaTallas';

import * as UsuarioModel from '../models/ConsultaUsuario';
export const renderTallasPage = async (req, res) => {
  try {
    const usuarioAutenticado = req.user.LoginUsuario;
    const detallesUsuario = await UsuarioModel.obtenerNombreUsuarioYRol(usuarioAutenticado);

    res.render('CtlTallas.ejs', { pageTitle: 'Tallas', user: detallesUsuario });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const GetTalla = async (req, res) => {
  try {
    const Tallas = await TallasModel.mostrarTallas(); // Corrige aquí
    res.json(Tallas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const guardarTalla = async (req, res) => {
  const { NumeroTalla, estado } = req.body;

  try {
    const tallas = await TallasModel.mostrarTallas();
    const tallaExistente = tallas.find((talla) => talla.NumeroTalla === NumeroTalla);

    if (tallaExistente) {
      return res.status(400).json({ error: 'Ya existe una talla con este número. Por favor, elige otro número.' });
    }

    const codigo = await TallasModel.guardarTallas(NumeroTalla, estado);
    res.status(201).json({ codigo, message: 'Talla creada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateTalla = async (req, res) => {
  const { NumeroTalla, estado } = req.body;
  const id = req.params.id;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'El ID proporcionado no es válido.' });
  }

  try {
    const tallas = await TallasModel.mostrarTallas();
    const tallaExistente = tallas.find((talla) => talla.Codigo === parseInt(id, 10));

    if (!tallaExistente) {
      return res.status(404).json({ error: 'No se encontró la talla con el ID proporcionado.' });
    }

    const numeroDuplicado = tallas.some(
      (talla) => talla.Codigo !== parseInt(id, 10) && talla.NumeroTalla === NumeroTalla
    );

    if (numeroDuplicado) {
      return res.status(400).json({ error: 'Ya existe una talla con este número. Por favor, elige otro número.' });
    }

   // ...
await TallasModel.actualizarTallas(parseInt(id, 10), NumeroTalla, estado, id);
res.json({ codigo: id, NumeroTalla, message: 'Talla actualizada exitosamente' });
// ...

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



export const darDeBajaTalla = async (req, res) => {
  const codigo = req.params.id;

  try {
    await TallasModel.darDeBajaTallas(codigo);
    res.json({ message: 'Talla dada de baja exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const activarTalla= async (req, res) => {
  const codigo = req.params.id;

  try {
    await TallasModel.activarTallas(codigo);
    res.json({ message: 'Talla activada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
