import * as ProveedoresModel from '../models/ConsultaProveedores';


import * as UsuarioModel from '../models/ConsultaUsuario';
export const renderProveedorPage = async (req, res) => {
  try {
    const usuarioAutenticado = req.user.LoginUsuario;
    const detallesUsuario = await UsuarioModel.obtenerNombreUsuarioYRol(usuarioAutenticado);

    res.render('CtlProveedores.ejs', { pageTitle: 'Proveedores', user: detallesUsuario });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const GetProveedores = async (req, res) => {
  try {
    const proveedores = await ProveedoresModel.mostrarProveedores();
    res.json(proveedores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const guardarProveedores = async (req, res) => {
  const { nombre, direccion, telefono, ruc, emailProveedor, estado } = req.body;

  try {
    const proveedores = await ProveedoresModel.mostrarProveedores();
    const proveedorExistente = proveedores.find((proveedor) => proveedor.RUC === ruc);

    if (proveedorExistente) {
      return res.status(400).json({ error: 'Ya existe un proveedor con este RUC.' });
    }

    const codigo = await ProveedoresModel.guardarProveedor(nombre, direccion, telefono, ruc, emailProveedor, estado);
    res.status(201).json({ codigo, message: 'Proveedor creado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateProveedores = async (req, res) => {
  const { nombre, direccion, telefono, ruc, emailProveedor, estado } = req.body;
  const { id } = req.params; // Extraer el ID de los parámetros de la ruta

  try {
    const proveedores = await ProveedoresModel.mostrarProveedores();
    const proveedorExistente = proveedores.find((proveedor) => proveedor.Codigo === parseInt(id, 10));

    if (!proveedorExistente) {
      return res.status(404).json({ error: 'No se encontró el proveedor con el ID proporcionado.' });
    }

    const rucDuplicado = proveedores.some(
      (proveedor) => proveedor.Codigo !== parseInt(id, 10) && proveedor.RUC === ruc
    );

    if (rucDuplicado) {
      return res.status(400).json({ error: 'Ya existe un proveedor con este RUC. Por favor, elige otro RUC.' });
    }

    await ProveedoresModel.actualizarProveedor(parseInt(id, 10),nombre, direccion, telefono, ruc, emailProveedor, estado);
    res.json({ message: 'Proveedor actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const darDeBajaProveedores = async (req, res) => {
  const codigo = req.params.id;

  try {
    await ProveedoresModel.darDeBajaProveedor(codigo);
    res.json({ message: 'Proveedor dada de baja exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const activarProveedores = async (req, res) => {
  const codigo = req.params.id;

  try {
    await ProveedoresModel.activarProveedor(codigo);
    res.json({ message: 'Proveedor activado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
