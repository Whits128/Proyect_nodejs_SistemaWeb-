import * as EmpleadoModel from '../models/ConsultaEmpleado';

import * as UsuarioModel from '../models/ConsultaUsuario';
export const renderEmpleadoPage = async (req, res) => {
  try {
    

    res.render('CtlEmpleado.ejs', { pageTitle: 'Empleado'});
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const GetEmpleado = async (req, res) => {
  try {
    const empleado = await EmpleadoModel.mostrarEmpleados();
    res.json(empleado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// empleadoController.js

export const guardarEmpleado = async (req, res) => {
  const { nombre, apellido, direccion, telefono, idUsuario, estado } = req.body;

  try {
    const empleados = await EmpleadoModel.mostrarEmpleados();

    const empleadoExistente = empleados.find(
      (empleado) => empleado.Nombre.toLowerCase() === nombre.toLowerCase()
    );
    console.log("empleadoExistente",empleadoExistente)

    if (empleadoExistente) {
      console.log('Ya existe un empleado con este nombre.');
      return res.status(400).json({ error: 'Ya existe un empleado con este nombre. Por favor, elige otro nombre.' ,
      message: 'Ya existe un empleado con este nombre.'});
    }

    const empleadoExistentePorUsuario = await EmpleadoModel.existeEmpleadoPorUsuario(idUsuario);

    if (empleadoExistentePorUsuario) {
      console.log('El ID de usuario ya está asociado a otro empleado.');
      return res.status(400).json({
        error: 'El ID de usuario ya está asociado a otro empleado. Por favor, elige otro ID de usuario.',
        message: 'El ID de usuario ya está asociado a otro empleado.'
      });
    }

    // Intenta guardar el nuevo empleado
    const codigo = await EmpleadoModel.guardarEmpleado(nombre, apellido, direccion, telefono, idUsuario, estado);
    console.log('Empleado guardado con éxito.');
    res.status(201).json({ codigo, message: 'Empleado creado exitosamente' });
  } catch (error) {
    // Personaliza las respuestas de error según el tipo de error
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof EmpleadoExistenteError) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};


export const updateEmpleado = async (req, res) => {
  const { nombre, apellido, direccion, telefono,idUsuario, estado } = req.body;
  const { id } = req.params; // Extraer el ID de los parámetros de la ruta

  try {
    const empleados = await EmpleadoModel.mostrarEmpleados();
    const empleadoExistente = empleados.find((empleado) => empleado.Codigo === parseInt(id, 10));

    if (!empleadoExistente) {
      return res.status(404).json({ error: 'No se encontró el empleado con el ID proporcionado.' });
    }

    const nombreDuplicado = empleados.some(
      (empleado) => empleado.Codigo !== parseInt(id, 10) && empleado.Nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (nombreDuplicado) {
      return res.status(400).json({ error: 'Ya existe un empleado con este nombre. Por favor, elige otro nombre.' });
    }

    await EmpleadoModel.actualizarEmpleado(parseInt(id, 10), nombre, apellido, direccion, telefono,idUsuario, estado);
    res.json({ message: 'Empleado actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const darDeBajaEmpleado = async (req, res) => {
  const codigo = req.params.id;

  try {
    await EmpleadoModel.darDeBajaEmpleado(codigo);
    res.json({ message: 'Empleado dada de baja exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const activarEmpleado = async (req, res) => {
  const codigo = req.params.id;

  try {
    await EmpleadoModel.activarEmpleado(codigo);
    res.json({ message: 'Empleado activado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
