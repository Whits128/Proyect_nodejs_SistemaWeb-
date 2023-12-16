import * as CompraModel from '../models/ColsultaCompra';
export const renderComprasPage = async (req, res) => {
    try {  
      res.render('MtlCompras.ejs', { pageTitle: 'Compras' });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };


  export const GetCompras = async (req, res) => {
    try {
      const compra = await CompraModel.mostrarCompra();
      res.json(compra);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };



  export const crearCompra = async (req, res) => {
    try {
      // Recuperar los datos de la solicitud
      const { CodigoCompra, FechaCompra, EstadoCompra, Total, DetallesCompra, ID_BODEGA, ID_ProductoZapatos, ID_Marca, ID_Talla, ID_Colores, ID_MaterialZapatos } = req.body;
  
      // Validar datos antes de procesar

      const CompraV = await CompraModel.mostrarCompra();
      const compraExistente = CompraV.find(
        (b) => b.CodigoCompra.toLowerCase() === CodigoCompra.toLowerCase()
      );
  
      if (compraExistente) {
        return res.status(400).json({ error: 'Ya existe una Una compra con este Codigo.' });
      }

      if (!CodigoCompra || !FechaCompra || !EstadoCompra || !Total || !DetallesCompra || !DetallesCompra.length) {
        return res.status(400).json({ success: false, error: 'Datos de compra incompletos o incorrectos.' });
      }
  
      // Transformar el objeto de detalles a formato XML
      const detallesXml = `<DetallesCompra>${DetallesCompra.map(detalle => `
        <Detalle>
          <ID_Inventario>${detalle.ID_Inventario}</ID_Inventario>
          <ID_Proveedor>${detalle.ID_Proveedor}</ID_Proveedor>
          <ID_BODEGA>${detalle.ID_BODEGA}</ID_BODEGA>
          <ID_Empleado>${detalle.ID_Empleado}</ID_Empleado>
          <Cantidad>${detalle.Cantidad}</Cantidad>
          <PrecioCompra>${detalle.PrecioCompra}</PrecioCompra>
          <Descuento>${detalle.Descuento}</Descuento>
          <Subtotal>${detalle.Subtotal}</Subtotal>
          <IVA>${detalle.IVA}</IVA>
          <Total>${detalle.Total}</Total>
        </Detalle>`).join('')}</DetallesCompra>`;
  
      // Imprimir los datos antes de la ejecución
      console.log('Datos que se enviarán al servidor:', req.body);
      // Imprimir el XML
      console.log('XML que se enviará al servidor:', detallesXml);
  
      // Llamar a la función del modelo para guardar la compra
      const result = await CompraModel.guardarCompra({
        CodigoCompra,
        FechaCompra,
        EstadoCompra,
        ID_BODEGA,
        ID_ProductoZapatos,
        ID_Marca,
        ID_Talla,
        ID_Colores,
        ID_MaterialZapatos,
        Total,
        DetallesCompra,
      });
  
      // Enviar una respuesta al cliente según el resultado
      res.json({ success: true, result });
    } catch (error) {
      // Manejar errores y enviar una respuesta de error al cliente
      console.error(error);
      res.status(500).json({ success: false, error: 'Error al crear la compra.' });
    }
  };
  

  export const editarCompra = async (req, res) => {
    try {
      // Recuperar los datos de la solicitud
      const { CodigoCompra, FechaCompra, EstadoCompra, Total, DetallesCompra, ID_BODEGA, ID_ProductoZapatos, ID_Marca, ID_Talla, ID_Colores, ID_MaterialZapatos } = req.body;
  
      // Validar datos antes de procesar
  
      const CompraV = await CompraModel.mostrarCompra();
      const compraExistente = CompraV.find(
        (b) => b.CodigoCompra.toLowerCase() === CodigoCompra.toLowerCase()
      );
  
      if (!compraExistente) {
        return res.status(404).json({ error: 'Compra no encontrada.' });
      }
  
      if (!CodigoCompra || !FechaCompra || !EstadoCompra || !Total || !DetallesCompra || !DetallesCompra.length) {
        return res.status(400).json({ success: false, error: 'Datos de compra incompletos o incorrectos.' });
      }
  
      // Transformar el objeto de detalles a formato XML
      const detallesXml = `<DetallesCompra>${DetallesCompra.map(detalle => `
        <Detalle>
          <ID_Inventario>${detalle.ID_Inventario}</ID_Inventario>
          <ID_Proveedor>${detalle.ID_Proveedor}</ID_Proveedor>
          <ID_BODEGA>${detalle.ID_BODEGA}</ID_BODEGA>
          <ID_Empleado>${detalle.ID_Empleado}</ID_Empleado>
          <Cantidad>${detalle.Cantidad}</Cantidad>
          <PrecioCompra>${detalle.PrecioCompra}</PrecioCompra>
          <Descuento>${detalle.Descuento}</Descuento>
          <Subtotal>${detalle.Subtotal}</Subtotal>
          <IVA>${detalle.IVA}</IVA>
          <Total>${detalle.Total}</Total>
        </Detalle>`).join('')}</DetallesCompra>`;
  
      // Imprimir los datos antes de la ejecución
      console.log('Datos que se enviarán al servidor:', req.body);
      // Imprimir el XML
      console.log('XML que se enviará al servidor:', detallesXml);
  
      // Llamar a la función del modelo para editar la compra
      const result = await CompraModel.editarCompraEnDB({
        CodigoCompra,
        FechaCompra,
        EstadoCompra,
        ID_BODEGA,
        ID_ProductoZapatos,
        ID_Marca,
        ID_Talla,
        ID_Colores,
        ID_MaterialZapatos,
        Total,
        DetallesCompra,
      });
  
      // Verificar si se actualizó al menos una fila (si la compra existía)
      if (result.rowsAffected[0] > 0) {
        res.json({ success: true, message: 'Compra editada exitosamente.' });
      } else {
        res.status(404).json({ success: false, error: 'Compra no encontrada.' });
      }
    } catch (error) {
      // Manejar errores y enviar una respuesta de error al cliente
      console.error(error);
      res.status(500).json({ success: false, error: 'Error al editar la compra.' });
    }
  };
  




  export const completarCompra = async (req, res) => {
    try {
   
      const codigo = req.params.id;
      // Llamar a la función del modelo para completar la compra
      const result = await CompraModel.completarCompraEnDB(codigo);
  
      // Verificar si se actualizó al menos una fila (si la compra existía)
      if (result.rowsAffected[0] > 0) {
        res.json({ success: true, message: 'Compra completada exitosamente.' });
      } else {
        res.status(404).json({ success: false, error: 'Compra no encontrada.' });
      }
    } catch (error) {
      // Manejar errores y enviar una respuesta de error al cliente
      console.error(error);
      res.status(500).json({ success: false, error: 'Error al completar la compra.' });
    }
  };




  export const ObtenerDetallesCompraPorCodigo= async (req, res) => {
    try {
   
      const codigo = req.params.id;
      // Llamar a la función del modelo para completar la compra
      const result = await CompraModel.ObtenerDatosParaEditar(codigo);
  
      // Verificar si se actualizó al menos una fila (si la compra existía)
    // Enviar una respuesta al cliente según el resultado
    res.json({ success: true, result });
    } catch (error) {
      // Manejar errores y enviar una respuesta de error al cliente
      console.error(error);
      res.status(500).json({ success: false, error: 'Error al completar la compra.' });
    }
  };

