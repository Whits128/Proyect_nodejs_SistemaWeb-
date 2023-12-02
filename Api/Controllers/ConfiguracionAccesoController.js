
import * as AccesoModel from '../models/ConsultaConfiguracionAcceso';
export const renderAccesosPage = async (req, res) => {
  try {
    
    res.render('CtlConfiguracionAcceso.ejs', { pageTitle: 'Configuracion de Acceso' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const GetRol= async (req, res) => {
  try {
    const rol = await AccesoModel.mostrarRoles();
    res.json(rol);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const GetRecursos = async (req, res) => {
  try {
    const recurso = await AccesoModel.mostrarRecurso();
    res.json(recurso);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const GetConfiguracionAcceso= async (req, res) => {
  try {
    const Acceso = await AccesoModel.mostrarConfiguracionesAcceso();
    res.json(Acceso);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




export const guardarAcceso = async (req, res) => {
  const { ruta, idRecurso, idRol } = req.body;

  try {
    const configuracionesAcceso = await AccesoModel.mostrarConfiguracionesAcceso();
    const accesoExistente = configuracionesAcceso.some(
      (acceso) => acceso.Ruta.toLowerCase() === ruta.toLowerCase()
    );

    if (accesoExistente) {
      const mensajes = {
        error: 'Ya existe una Configuración de Acceso con esta ruta. Por favor, elige otra ruta.',
      };
      return res.render('CtlConfiguracionAcceso.ejs', { mensajes });
    }

    const codigo = await AccesoModel.guardarConfiguracionAcceso(ruta, idRecurso, idRol);
 
    
  } catch (error) {
    console.error(error);
    const mensajes = {
      error: 'Error interno del servidor.',
    };
    res.status(500).render('tu_vista.ejs', { mensajes });
  }
};

export const updateAcceso = async (req, res) => {
  const { ruta,idRecurso,idRol} = req.body;
  const { id } = req.params; // Extraer el ID de los parámetros de la ruta

  try {
    const acceso = await AccesoModel.mostrarConfiguracionesAcceso();
    const accesoExistente = acceso.find((b) => b.Codigo === parseInt(id, 10));

    if (!accesoExistente) {
      return res.status(404).json({ error: 'No se encontró la La configuracion con el ID proporcionado.' });
    }

    const accesoDuplicada = acceso.some((b) => {
      return b.Codigo !== parseInt(id, 10) && b.Ruta.toLowerCase() === ruta.toLowerCase();
    });

    if (accesoDuplicada) {
      return res.status(400).json({ error: 'Ya existe una Configuracion con este ruta. Por favor, elige otro ruta.' });
    }

    await AccesoModel.actualizarConfiguracionAcceso(parseInt(id, 10), ruta,idRecurso,idRol);
    res.json({ message: 'Configuración de Acceso actualizada exitosamente' });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
