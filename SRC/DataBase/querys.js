export const querys = {
    // Consultas relacionadas con productos
   // getAllProducts:"SELECT ID_Producto as codigo, Nombre as nombre, Stock as stock, Estado as estado FROM Productos",

    
  //Consultas de Categoria//
  MostrarCategoria: "SELECT ID_Categoria as Codigo, Nombre as Nombre , Estado as Estado FROM Categorias",
  GuardarCategoria: "INSERT INTO Categorias (Nombre,Estado) VALUES (@nombre, @estado)",
  updateCategoria: "UPDATE Categorias SET Nombre = @nombre ,Estado = @estado   WHERE ID_Categoria = @codigo ",
  

//Consultas de Productos//
MostrarProducto: "   SELECT  PZ.[ID_ProductoZapatos] as Codigo,PZ.Nombre as Nombre,PZ.Descripcion as Descripcion,C.Nombre as Categoria, PZ.Estado as Estado FROM Productos_Zapatos PZ JOIN Categorias C ON PZ.ID_Categoria = C.ID_Categoria",
GuardarProducto: "INSERT INTO Productos_Zapatos (Nombre,Descripcion,ID_Categoria,Estado) VALUES (@nombre,@descripcion,@id_categoria, @estado)",
updateProducto: "UPDATE Productos_Zapatos SET Nombre = @nombre ,Descripcion =@descripcion,ID_Categoria=@id_categoria,Estado= @estado   WHERE ID_ProductoZapatos = @codigo ",


//Consultas de Colores//
MostrarColores: "  SELECT  ID_Colores as Codigo ,Color , Estado    FROM   Colores",
GuardarColores: "INSERT INTO Colores (Color, Estado) VALUES (@color, @estado)",
updateColores: "UPDATE Colores SET Color = @color ,Estado= @estado   WHERE ID_Colores = @codigo ",

//Consultas de Marcas//
MostrarMarcas: "SELECT  ID_Marca as Codigo ,Nombre ,DetalleMarca as Detalle , Estado    FROM   Marcas",
GuardarMarcas: "INSERT INTO Marcas (Nombre, DetalleMarca, Estado) VALUES (@nombre, @detalleMarca, @estado)",
updateMarcas: "UPDATE Marcas SET Nombre = @nombre ,DetalleMarca = @detalleMarca , Estado= @estado   WHERE ID_Marca= @codigo ",
//Consultas de Tallas//
MostrarTallas: "SELECT ID_Talla as Codigo, Nombre, Estado FROM Tallas",
GuardarTallas: "INSERT INTO Tallas (Nombre,Estado) VALUES (@nombre, @estado)",
UpdateTallas: "UPDATE Tallas SET Nombre = @nombre, Estado = @estado WHERE ID_Talla = @codigo",
//Consultas de MaterialesZapatos//
MostrarMaterialesZapatos: "SELECT ID_MaterialZapatos AS Codigo,Nombre,Descripcion,TipoMaterial,TipodeCostura,TipoSuela,Fabricante,Observaciones,Estado FROM MaterialesZapatos",
GuardarMaterialesZapatos: "INSERT INTO MaterialesZapatos (Nombre, Descripcion, TipoMaterial, TipodeCostura, TipoSuela, Fabricante, Observaciones, Estado) VALUES (@nombre, @descripcion, @tipoMaterial, @tipodeCostura, @tipoSuela, @fabricante, @observaciones, @estado);",
UpdateMaterialesZapatos: "UPDATE MaterialesZapatos SET Nombre = @nombre, Descripcion = @descripcion,TipoMaterial = @tipoMaterial,TipodeCostura = @tipodeCostura,TipoSuela = @tipoSuela,Fabricante = @fabricante,Observaciones = @observaciones,Estado = @estado WHERE ID_MaterialZapatos = @codigo;",


  };
  