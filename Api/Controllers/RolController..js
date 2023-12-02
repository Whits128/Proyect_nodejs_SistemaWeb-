import * as RolModel from '../models/ConsultaRol';


import * as UsuarioModel from '../models/ConsultaUsuario';
export const renderRolPage = async (req, res) => {
  try {
  
    res.render('CtlRol.ejs', { pageTitle: 'Roles'});
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const GetRol = async (req, res) => {
  try {
    const rol = await RolModel.mostrarRoles(); // Corrige aquí
    res.json(rol);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// En tu controlador guardarRol
export const guardarRol = async (req, res) => {
  const { nombre, estado } = req.body;

  try {
    // Verificar si el rol con el nombre proporcionado ya existe
    const roles = await RolModel.mostrarRoles();
    const rolExistente = roles.find((rol) => rol.Nombre.toLowerCase() === nombre.toLowerCase());

    if (rolExistente) {
      return res.status(400).json({ error: 'Ya existe un rol con este nombre. Por favor, elige otro nombre.' });
    }

    // Si no existe, proceder con el guardado
    const codigo = await RolModel.guardarRol(nombre, estado);
    res.status(201).json({ codigo, message: 'Rol creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error inesperado al procesar la solicitud.' });
  }
};


export const updateRol = async (req, res) => {
  const { id } = req.params; // Extraer el ID de los parámetros de la ruta
  const { nombre, estado } = req.body;

  // Verificar si el ID es válido antes de intentar actualizar
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'El ID proporcionado no es válido.' });
  }

  try {
    // Verificar si el rol con el ID proporcionado existe
    const roles = await RolModel.mostrarRoles();
    const rolExistente = roles.find((rol) => rol.Codigo === parseInt(id, 10));

    if (!rolExistente) {
      return res.status(404).json({ error: 'No se encontró el rol con el ID proporcionado.' });
    }

    // Verificar si el nombre ya existe para otro rol (excluyendo el rol actual)
    const nombreDuplicado = roles.some(
      (rol) => rol.Codigo !== parseInt(id, 10) && rol.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (nombreDuplicado) {
      return res.status(400).json({ error: 'Ya existe un rol con este nombre. Por favor, elige otro nombre.' });
    }

    // Continuar con la actualización
    await RolModel.actualizarRol(parseInt(id, 10), nombre, estado);
    res.json({ message: 'Rol actualizado exitosamente' });
  } catch (error) {
    handleError(res, error);
  }
};

export const darDeBajaRol = async (req, res) => {
  const codigo = req.params.id;

  try {
    await RolModel.darDeBajaRol(codigo);
    res.json({ message: 'Rol dado de baja exitosamente' });
  } catch (error) {
    handleError(res, error);
  }
};

export const activarRol = async (req, res) => {
  const codigo = req.params.id;

  try {
    await RolModel.activarRol(codigo);
    res.json({ message: 'Rol activado exitosamente' });
  } catch (error) {
    handleError(res, error);
  }
};
