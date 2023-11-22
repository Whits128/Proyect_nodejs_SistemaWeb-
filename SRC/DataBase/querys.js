export const querys = {
    // Consultas relacionadas con productos
   // getAllProducts:"SELECT ID_Producto as codigo, Nombre as nombre, Stock as stock, Estado as estado FROM Productos",

    
  //Consultas de Categoria//
  MostrarCategoria: "SELECT ID_Categoria as Codigo, Nombre as Nombre , Estado as Estado FROM Categorias",
  GuardarCategoria: "INSERT INTO Categorias (Nombre,Estado) VALUES (@nombre, @estado)",
  updateCategoria: "UPDATE Categorias SET Nombre = @nombre ,Estado = @estado   WHERE ID_Categoria = @codigo ",
  DarDeBajaCategoria: "UPDATE Categorias SET Estado = 'Inactivo' WHERE ID_Categoria = @codigo;",
  ActivarCategoria: "UPDATE Categorias SET Estado = 'Activo' WHERE ID_Categoria = @codigo;",

//Consultas de Productos//
MostrarProducto: "   SELECT  PZ.[ID_ProductoZapatos] as Codigo,PZ.Nombre as Nombre,PZ.Descripcion as Descripcion,C.Nombre as Categoria, PZ.Estado as Estado FROM Productos_Zapatos PZ JOIN Categorias C ON PZ.ID_Categoria = C.ID_Categoria",
GuardarProducto: "INSERT INTO Productos_Zapatos (Nombre,Descripcion,ID_Categoria,Estado) VALUES (@nombre,@descripcion,@id_categoria, @estado)",
updateProducto: "UPDATE Productos_Zapatos SET Nombre = @nombre ,Descripcion =@descripcion,ID_Categoria=@id_categoria,Estado= @estado   WHERE ID_ProductoZapatos = @codigo ",


//Consultas de Colores//
MostrarColores: "  SELECT  ID_Colores as Codigo ,Color , Estado    FROM   Colores",
GuardarColores: "INSERT INTO Colores (Color, Estado) VALUES (@color, @estado)",
updateColores: "UPDATE Colores SET Color = @color ,Estado= @estado   WHERE ID_Colores = @codigo ",
DarDeBajaColores: "UPDATE Colores SET Estado = 'Inactivo' WHERE ID_Colores = @codigo;",
ActivarColores: "UPDATE Colores SET Estado = 'Activo' WHERE ID_Colores = @codigo;",
//Consultas de Marcas//
MostrarMarcas: "SELECT  ID_Marca as Codigo ,Nombre ,DetalleMarca as Detalle , Estado    FROM   Marcas",
GuardarMarcas: "INSERT INTO Marcas (Nombre, DetalleMarca, Estado) VALUES (@nombre, @detalleMarca, @estado)",
updateMarcas: "UPDATE Marcas SET Nombre = @nombre ,DetalleMarca = @detalleMarca , Estado= @estado   WHERE ID_Marca= @codigo",
DarDeBajaMarcas: "UPDATE Marcas SET Estado = 'Inactivo' WHERE ID_Marca = @codigo;",
ActivarMarcas: "UPDATE Marcas SET Estado = 'Activo' WHERE ID_Marca = @codigo;",

//Consultas de Tallas//
MostrarTallas: "SELECT ID_Talla as Codigo, NumeroTalla, Estado FROM Tallas",
GuardarTallas: "INSERT INTO Tallas (NumeroTalla,Estado) VALUES (@NumeroTalla, @estado)",
UpdateTallas: "UPDATE Tallas SET NumeroTalla = @NumeroTalla, Estado = @estado WHERE ID_Talla = @codigo",
DarDeBajaTallas: "UPDATE Tallas SET Estado = 'Inactivo' WHERE ID_Talla = @codigo;",
ActivarTallas: "UPDATE Tallas SET Estado = 'Activo' WHERE ID_Talla = @codigo;",
//Consultas de MaterialesZapatos//
MostrarMaterialesZapatos: "SELECT ID_MaterialZapatos AS Codigo,Nombre,Descripcion,TipoMaterial,TipodeCostura,TipoSuela,Fabricante,Observaciones,Estado FROM MaterialesZapatos",
GuardarMaterialesZapatos: "INSERT INTO MaterialesZapatos (Nombre, Descripcion, TipoMaterial, TipodeCostura, TipoSuela, Fabricante, Observaciones, Estado) VALUES (@nombre, @descripcion, @tipoMaterial, @tipodeCostura, @tipoSuela, @fabricante, @observaciones, @estado);",
UpdateMaterialesZapatos: "UPDATE MaterialesZapatos SET Nombre = @nombre, Descripcion = @descripcion,TipoMaterial = @tipoMaterial,TipodeCostura = @tipodeCostura,TipoSuela = @tipoSuela,Fabricante = @fabricante,Observaciones = @observaciones,Estado = @estado WHERE ID_MaterialZapatos = @codigo;",
DarDeBajaMaterialesZapatos: "UPDATE MaterialesZapatos SET Estado = 'Inactivo' WHERE ID_MaterialZapatos = @codigo;",
ActivarMaterialesZapatos: "UPDATE MaterialesZapatos SET Estado = 'Activo' WHERE ID_MaterialZapatos = @codigo;",
//Consultas de Empleado//
MostrarEmpleados: "SELECT ID_Empleado AS Codigo, Nombre, Apellido, Direccion, Telefono, Estado FROM Empleados",
GuardarEmpleado: "INSERT INTO Empleados (Nombre, Apellido, Direccion, Telefono, Estado) VALUES (@nombre, @apellido, @direccion, @telefono, @estado);",
UpdateEmpleado: "UPDATE Empleados SET Nombre = @nombre, Apellido = @apellido, Direccion = @direccion, Telefono = @telefono, Estado = @estado WHERE ID_Empleado = @codigo;",
DarDeBajaEmpleado: "UPDATE Empleados SET Estado = 'Inactivo' WHERE ID_Empleado = @codigo;",
ActivarEmpleado: "UPDATE Empleados SET Estado = 'Activo' WHERE ID_Empleado = @codigo;",
//consultas Zapatos dañados//
MostrarZapatosDanados: "SELECT ZD.ID_ZapatoDanado AS Codigo, PZ.Nombre AS NombreProducto, ZD.DescripcionDanos, ZD.FechaDeteccion, ZD.AccionesTomadas, ZD.Estado FROM ZapatosDanados ZD JOIN Productos_Zapatos PZ ON ZD.ID_ProductoZapatos = PZ.ID_ProductoZapatos",
GuardarZapatoDanado: "INSERT INTO ZapatosDanados (ID_ProductoZapatos, DescripcionDanos, FechaDeteccion, AccionesTomadas, Estado) VALUES (@idProducto, @descripcion, @fechaDeteccion, @acciones, @estado);",
UpdateZapatoDanado: "UPDATE ZapatosDanados SET ID_ProductoZapatos = @idProducto, DescripcionDanos = @descripcion, FechaDeteccion = @fechaDeteccion, AccionesTomadas = @acciones, Estado = @estado WHERE ID_ZapatoDanado = @codigo;",

MostrarPromociones: "SELECT ID_Promocion AS Codigo, Nombre, Descripcion, FechaInicio, FechaFin, Estado FROM Promociones",
GuardarPromociones: "INSERT INTO Promociones (Nombre, Descripcion, FechaInicio, FechaFin, Estado) VALUES (@nombre, @descripcion, @fechaInicio, @fechaFin, @estado);",
UpdatePromociones: "UPDATE Promociones SET Nombre = @nombre, Descripcion = @descripcion, FechaInicio = @fechaInicio, FechaFin = @fechaFin, Estado = @estado WHERE ID_Promocion = @codigo;",
DarDeBajaPromociones: "UPDATE Promociones SET Estado = 'Inactivo' WHERE ID_Promocion = @codigo",
ActivarPromociones: "UPDATE Promociones SET Estado = 'Activo' WHERE ID_Promocion = @codigo",
//consultas Configuracion
mostrarConfiguraciones:"SELECT PKConfiguraciones as Codigo, NombreNegocio, LogoLocal, RUC, Telefonos, Correo, Direccion, Estado, FechaModificacion, UsuarioModificacion, TipoOperacion FROM Configuraciones",
cargarHistorial:"SELECT H.PKHistorial, C.NombreNegocio AS NombreLocal, H.ColumnaModificada,  H.ValorAntiguo, H.ValorNuevo, H.FechaModificacion, H.UsuarioModificacion, H.TipoOperacion FROM HistorialConfiguraciones H JOIN  Configuraciones C ON H.FKConfiguraciones = C.PKConfiguraciones;",
DarDeBajaConfiguraciones: "UPDATE Configuraciones SET Estado = 'Inactivo' WHERE FKConfiguraciones = @codigo;",
ActivarConfiguraciones: "UPDATE Configuraciones SET Estado = 'Activo' WHERE FKConfiguraciones = @codigo;",

// Consultas de BODEGA
MostrarBodegas: "SELECT ID_BODEGA as Codigo, NOMBRE, UBICACION, Estado FROM BODEGA",
GuardarBodega: "INSERT INTO BODEGA (NOMBRE, UBICACION, Estado) VALUES (@nombre, @ubicacion, @estado)",
ActualizarBodega: "UPDATE BODEGA SET NOMBRE = @nombre, UBICACION = @ubicacion, Estado = @estado WHERE ID_BODEGA = @codigo",
DarDeBajaBodega: "UPDATE BODEGA SET Estado = 'Inactivo' WHERE ID_BODEGA = @codigo",
ActivarBodega: "UPDATE BODEGA SET Estado = 'Activo' WHERE ID_BODEGA = @codigo",




};
  