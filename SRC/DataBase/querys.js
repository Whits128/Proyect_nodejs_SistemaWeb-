export const querys = {
    // Consultas relacionadas con productos
   // getAllProducts:"SELECT ID_Producto as codigo, Nombre as nombre, Stock as stock, Estado as estado FROM Productos",

    
  //Consultas de Categoria//
  MostrarCategoria: "SELECT ID_Categoria as Codigo, Nombre as Nombre , Estado as Estado FROM Categorias",
  GuardarCategoria: "INSERT INTO Categorias (Nombre,Estado) VALUES (@nombre, @estado)",
  updateCategoria: "UPDATE Categorias SET Nombre = @nombre ,Estado = @estado   WHERE ID_Categoria = @codigo ",
  

//Consultas de Categoria//
MostrarProducto: "   SELECT  PZ.[ID_ProductoZapatos] as Codigo,PZ.Nombre as Nombre,PZ.Descripcion as Descripcion,C.Nombre as Categoria, PZ.Estado as Estado FROM Productos_Zapatos PZ JOIN Categorias C ON PZ.ID_Categoria = C.ID_Categoria",
GuardarProducto: "INSERT INTO Productos_Zapatos (Nombre,Descripcion,ID_Categoria,Estado) VALUES (@nombre,@descripcion,@id_categoria, @estado)",
updateProducto: "UPDATE Productos_Zapatos SET Nombre = @nombre ,Descripcion =@descripcion,ID_Categoria=@id_categoria,Estado= @estado   WHERE ID_ProductoZapatos = @codigo ",


  };
  