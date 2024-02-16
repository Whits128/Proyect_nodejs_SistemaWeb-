
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
    const recurso = await AccesoModel.mostrarRecursos();
    res.json(recurso);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const GetAcciones = async (req, res) => {
  try {
    const acciones = await AccesoModel.mostrarAcciones();
    res.json(acciones);
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


export const crearConfiguracionAcceso = async (req, res) => {
  try {
    // Recuperar los datos de la solicitud
    const { ConfiguracionesXML} = req.body;
console.log('antes de validar:',ConfiguracionesXML)
    // Validar datos antes de procesar

   // Verificar si las configuraciones ya existen en la base de datos
   const configuracionesExistentes = await AccesoModel.mostrarConfiguracionesAcceso();

   if (!configuracionesExistentes) {
     // Si configuracionesExistentes es undefined, enviar una respuesta indicando el error
     return res.status(500).json({ success: false, error: 'Error al obtener configuraciones existentes.' });
   }

   const configuracionesExisten = ConfiguracionesXML.some(configuracion => {
     return configuracionesExistentes.some(existingConfig =>
       existingConfig.IdRecurso === configuracion.IdRecurso &&
       existingConfig.IdAccion === configuracion.IdAccion &&
       existingConfig.IdRol === configuracion.IdRol
     );
   });

   if (configuracionesExisten) {
     // Si ya existen, enviar una respuesta indicando que no se pueden crear configuraciones duplicadas
     return res.status(400).json({ success: false, error: 'Las configuraciones ya existen en la base de datos.' });
   }
    // Transformar el objeto de detalles a formato XML
    const detallesXml = `<Configuraciones>${ConfiguracionesXML.map(Configuracion => {
      return `
        <Configuracion>
          <IdRecurso>${Configuracion.IdRecurso}</IdRecurso>
          <IdAccion>${Configuracion.IdAccion}</IdAccion>
          <IdRol>${Configuracion.IdRol}</IdRol>
        </Configuracion>`;
    }).join('')}</Configuraciones>`;
    
    
    // Imprimir los datos antes de la ejecución
    console.log('Datos que se enviarán al servidor:', req.body);
    // Imprimir el XML
    console.log('XML que se enviará al servidor:', detallesXml);

    // Llamar a la función del modelo para guardar la compra
    const result = await AccesoModel.guardarConfiguracionAccesos({
      ConfiguracionesXML
    });

    // Enviar una respuesta al cliente según el resultado
    res.json({ success: true, result });
  } catch (error) {
    // Manejar errores y enviar una respuesta de error al cliente
    console.error(error);
    res.status(500).json({ success: false, error: 'Error al crear la compra.' });
  }
};



