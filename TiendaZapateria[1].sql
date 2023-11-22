-- Crear la base de datos
CREATE DATABASE TiendaZapateria;
GO

-- Utilizar la base de datos
USE TiendaZapateria;
GO
-- Tabla de Roles
CREATE TABLE Roles (
    IdRol INT PRIMARY KEY IDENTITY(1,1),
    NombreRol NVARCHAR(50) UNIQUE NOT NULL
);
GO


-- Tabla de Usuarios
CREATE TABLE USUARIO (
    IdUsuario INT PRIMARY KEY IDENTITY(1,1),
    Nombres VARCHAR(100),
    Apellidos VARCHAR(100),
    LoginUsuario VARCHAR(50),
    LoginClave VARCHAR(100),
    IdRol INT REFERENCES Roles(IdRol),
    Estado NVARCHAR(50) DEFAULT 'Activo',
    FechaRegistro DATETIME DEFAULT GETDATE()
);
GO
-- Tabla de Recursos (páginas o funcionalidades)
CREATE TABLE Recursos (
    IdRecurso INT PRIMARY KEY IDENTITY(1,1),
    NombreRecurso NVARCHAR(100) UNIQUE NOT NULL
);
GO
-- Tabla de Configuración de Acceso
CREATE TABLE ConfiguracionAcceso (
    IdConfiguracion INT PRIMARY KEY IDENTITY(1,1),
    Ruta NVARCHAR(255) UNIQUE NOT NULL,
    IdRecurso INT FOREIGN KEY REFERENCES Recursos(IdRecurso),
    IdRol INT FOREIGN KEY REFERENCES Roles(IdRol)
);
GO

-- Tabla Configuraciones
CREATE TABLE Configuraciones (
    PKConfiguraciones INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    NombreNegocio NVARCHAR(250),
    LogoLocal NVARCHAR(MAX),
    RUC NVARCHAR(20),
    Telefonos NVARCHAR(100),
    Correo NVARCHAR(100),
    Direccion NVARCHAR(255),
    Estado NVARCHAR(50) DEFAULT 'Activo',
    FechaModificacion DATETIME2 DEFAULT GETDATE() NOT NULL,
    UsuarioModificacion NVARCHAR(50),
    TipoOperacion NVARCHAR(20) DEFAULT 'INSERT' -- Puede ser 'INSERT', 'UPDATE', 'DELETE', etc.
);
GO

-- Tabla HistorialConfiguraciones
CREATE TABLE HistorialConfiguraciones (
    PKHistorial INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    FKConfiguraciones INT FOREIGN KEY REFERENCES Configuraciones(PKConfiguraciones),
    ColumnaModificada NVARCHAR(50), -- Nueva columna para indicar la columna modificada
    ValorAntiguo NVARCHAR(MAX),
    ValorNuevo NVARCHAR(MAX),
    FechaModificacion DATETIME2 DEFAULT GETDATE() NOT NULL,
    UsuarioModificacion NVARCHAR(50),
    TipoOperacion NVARCHAR(20) DEFAULT 'UPDATE'
);



GO
-- Tabla Marcas
CREATE TABLE Marcas (
    ID_Marca INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(100) UNIQUE NOT NULL,
    DetalleMarca VARCHAR(100),
   Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla Colores
CREATE TABLE Colores (
    ID_Colores INT PRIMARY KEY IDENTITY(1,1),
    Color VARCHAR(255) UNIQUE NOT NULL,
    Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla Categorias
CREATE TABLE Categorias (
    ID_Categoria INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(100) UNIQUE NOT NULL,
     Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla Tallas
CREATE TABLE Tallas (
    ID_Talla INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    NumeroTalla VARCHAR(10) UNIQUE NOT NULL,
     Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla Materiales para Zapatos
CREATE TABLE MaterialesZapatos (
    ID_MaterialZapatos INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) UNIQUE NOT NULL,
    Descripcion TEXT,
    TipoMaterial VARCHAR(50),
	TipodeCostura  VARCHAR(50),
	TipoSuela VARCHAR(50),
    Fabricante VARCHAR(100),
    Observaciones TEXT,
    Estado Nvarchar(50) DEFAULT 'Activo'
);

-- Tabla Productos
CREATE TABLE Productos_Zapatos (
    ID_ProductoZapatos INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) UNIQUE NOT NULL,
    Descripcion NVARCHAR(MAX),
    ID_Categoria INT FOREIGN KEY REFERENCES Categorias(ID_Categoria),
     Estado Nvarchar(50) DEFAULT 'Activo',
);
GO

-- Tabla Empleados
CREATE TABLE Empleados (
    ID_Empleado INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) UNIQUE NOT NULL,
    Apellido VARCHAR(100),
    Direccion VARCHAR(200),
    Telefono VARCHAR(20),
  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO


CREATE TABLE ZapatosDanados (
    ZapatoDanadoID INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    ProductoZapatosID INT UNIQUE NOT NULL,
    DescripcionDanos NVARCHAR(MAX),
    FechaDeteccion DATE,
    AccionesTomadas NVARCHAR(MAX),
  Estado Nvarchar(50) DEFAULT 'Activo'
    CONSTRAINT FK_ProductoZapatos_ZapatoDanado FOREIGN KEY (ProductoZapatosID) REFERENCES Productos_Zapatos(ID_ProductoZapatos),
);




-- Tabla Promociones
CREATE TABLE Promociones (
    ID_Promocion INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) UNIQUE NOT NULL,
    Descripcion VARCHAR(200),
    FechaInicio DATE,
    FechaFin DATE,
    Estado Nvarchar(50) DEFAULT 'Activo',
);


GO

-- Tabla PRODUCTOS_PROMOCIONES
CREATE TABLE PRODUCTOS_PROMOCIONES (
    ID_PRODUCTOS_PROMOCIONES INT PRIMARY KEY IDENTITY(1,1),
    ID_ProductoZapatos INT FOREIGN KEY REFERENCES Productos_Zapatos(ID_ProductoZapatos),
    ID_Promocion INT FOREIGN KEY REFERENCES Promociones(ID_Promocion)
);
GO
-- Tabla BODEGA
CREATE TABLE BODEGA (
    ID_BODEGA INT PRIMARY KEY IDENTITY(1,1),
    NOMBRE VARCHAR(100) UNIQUE NOT NULL,
    UBICACION VARCHAR(100),
    Estado Nvarchar(50) DEFAULT 'Activo',
);
GO

-- Tabla Inventario
CREATE TABLE Inventario (
    ID_Inventario INT PRIMARY KEY IDENTITY(1,1),
    ID_BODEGA INT FOREIGN KEY REFERENCES BODEGA(ID_BODEGA),
    ID_ProductoZapatos INT FOREIGN KEY REFERENCES Productos_Zapatos(ID_ProductoZapatos),
    ID_Marca INT FOREIGN KEY REFERENCES Marcas(ID_Marca),
    ID_Talla INT FOREIGN KEY REFERENCES Tallas(ID_Talla),
    ID_Colores INT FOREIGN KEY REFERENCES Colores(ID_Colores),
    ID_MaterialZapatos INT FOREIGN KEY REFERENCES MaterialesZapatos(ID_MaterialZapatos),
    UnidadesExistencias SMALLINT NOT NULL,
    FechaIngreso DATETIME NOT NULL,
    PrecioCompra MONEY NOT NULL,
    Descuento MONEY NOT NULL,
    PrecioVenta MONEY NOT NULL,
    ExistenciasMinimas INT NOT NULL,
     Estado Nvarchar(50) DEFAULT 'Activo'
);
GO
-- Tabla MovimientosBodegas
CREATE TABLE TblMovimientosBodegas (
    PKMovimientosBodega INT PRIMARY KEY CLUSTERED IDENTITY(1,1) NOT NULL,
    ID_Inventario INT FOREIGN KEY REFERENCES Inventario(ID_Inventario) NOT NULL,
    PKEmpleado INT NOT NULL,
    FechaMovimiento DATETIME NOT NULL,
    Descripcion NVARCHAR(250) NOT NULL,
    Cantidad FLOAT NOT NULL,
    ID_BODEGA INT FOREIGN KEY REFERENCES BODEGA(ID_BODEGA) NOT NULL,
    TipoMovimiento NVARCHAR(50) NOT NULL,
   Estado Nvarchar(50) DEFAULT 'Activo'
);
GO
-- Tabla Ventas
CREATE TABLE Ventas (
    ID_Venta INT PRIMARY KEY IDENTITY(1,1),
	CodigoVenta nvarchar(max) NOT NULL,
    Total DECIMAL(10, 2),
    Fecha DATE,
  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla DetalleVenta
CREATE TABLE DetalleVenta (
    ID_DetalleVenta INT PRIMARY KEY IDENTITY(1,1),
	ID_Venta INT FOREIGN KEY REFERENCES Ventas(ID_Venta) NOT NULL,
    ID_Inventario INT FOREIGN KEY REFERENCES Inventario(ID_Inventario) NOT NULL,
    ID_Promocion INT FOREIGN KEY REFERENCES Promociones(ID_Promocion) NULL,
    ID_Empleado INT FOREIGN KEY REFERENCES Empleados(ID_Empleado) NOT NULL,
	PrecioVenta money NOT NULL,
    Cantidad INT NOT NULL ,
    Descuento DECIMAL(10, 2),
    Total DECIMAL(10, 2) NOT NULL,
    Subtotal DECIMAL(10, 2) NOT NULL,
    IVA DECIMAL(10, 2),
    Fecha DATE NOT NULL,
  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO 


-- Tabla Proveedores
CREATE TABLE Proveedores (
    ID_Proveedor INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100) UNIQUE,
    Direccion VARCHAR(200),
    Telefono VARCHAR(20),
    Ruc NVARCHAR(100) NULL,
    DireccionProveedor NVARCHAR(650) NOT NULL,
    Departamento NVARCHAR(100) NULL,
    Municipio NVARCHAR (50),
    EmailProveedor NVARCHAR(200) NOT NULL,
  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla Compras
CREATE TABLE Compras (
    ID_Compra INT PRIMARY KEY IDENTITY(1,1),
	CodigoCompra nvarchar(max) NOT NULL,
    FechaCompra DATETIME NOT NULL,
    Total DECIMAL(10, 2),
  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla Facturas
CREATE TABLE Facturas (
    ID_Factura INT PRIMARY KEY IDENTITY(1,1),
    Fecha DATE,
    Total DECIMAL(10, 2),
	  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla DetalleFactura
CREATE TABLE Detalle_Factura (
    ID_DetalleFactura INT PRIMARY KEY IDENTITY(1,1),
    ID_Factura INT FOREIGN KEY REFERENCES Facturas(ID_Factura),
    ID_ProductoZapatos INT FOREIGN KEY REFERENCES Productos_Zapatos(ID_ProductoZapatos),
    Cantidad INT,
    PrecioUnitario DECIMAL(10, 2),
    Subtotal DECIMAL(10, 2),
    Descuento DECIMAL(10, 2),
	  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO

-- Tabla DetalleCompra
CREATE TABLE DetalleCompra (
    ID_DetalleCompra INT PRIMARY KEY IDENTITY(1,1),
    ID_Compra INT FOREIGN KEY REFERENCES Compras(ID_Compra),
    ID_ProductoZapatos INT FOREIGN KEY REFERENCES Productos_Zapatos(ID_ProductoZapatos),
    ID_Proveedor INT FOREIGN KEY REFERENCES Proveedores(ID_Proveedor),
    ID_Empleado INT FOREIGN KEY REFERENCES Empleados(ID_Empleado),
    FechaCompra DATETIME NOT NULL,
    Cantidad INT,
    PrecioUnitario DECIMAL(10, 2),
    Descuento DECIMAL(10, 2),
    Total DECIMAL(10, 2),
    Subtotal DECIMAL(10, 2),
    IVA DECIMAL(10, 2),
	  Estado Nvarchar(50) DEFAULT 'Activo'
);
GO


CREATE TABLE Devoluciones (
    ID_Devolucion INT PRIMARY KEY IDENTITY(1,1),
    ID_Venta INT FOREIGN KEY REFERENCES Ventas(ID_Venta) NOT NULL,
    ID_Inventario INT FOREIGN KEY REFERENCES Inventario(ID_Inventario) NOT NULL,
    ID_Empleado INT FOREIGN KEY REFERENCES Empleados(ID_Empleado),
    CantidadDevuelta INT NOT NULL,
    Motivo VARCHAR(200),
    Fecha DATE NOT NULL,
    Estado Nvarchar(50) DEFAULT 'Activo'
);

GO


 -- Llenar la tabla de Recursos con datos de ejemplo
INSERT INTO Recursos (NombreRecurso)
VALUES
       ('Gestión de Roles'),
       ('Asignar Permisos a Roles'),
       ('Gestión de Usuarios'),
       ('Restablecer Contraseña'),
	   ('Gestión de Recursos'),
       ('Asignar Recursos a Roles'),
       ('Configuración del Negocio'),
       ('Historial de Configuraciones'),
	      ('Gestión de Marcas'),
       ('Gestión de Colores'),
       ('Gestión de Categorías'),
       ('Gestión de Tallas'),
	     ('Gestión de Materiales'),
       ('Gestión de Empleados'),
	   ('Gestión de  Zapatos Dañados'),
       ('Registro de Zapatos Dañados'),
         ('Gestión de Promociones'),
       ('Asociar Productos a Promociones'),
	    ('Gestión de Bodegas'),
	   ('Registro de Movimientos de Bodegas'),
       ('Gestión de Inventario'),
	    ('Registro de Ventas'),
	    ('Detalle de Ventas'),
		('Gestión de Devoluciones'),
		('Gestión de Proveedores'),
		('Registro de Compras'),
		('Detalle de Compras'),
		('Registro de Facturas'),
		('Detalle de Facturas');
	 go
	   -- Insertar datos en la tabla "Roles"
INSERT INTO Roles (NombreRol)
VALUES
    ('Administrador'),
    ('Usuario Regular'),
    ('Moderador'),
    ('Invitado');
go
INSERT INTO ConfiguracionAcceso (Ruta, IdRecurso, IdRol) VALUES
 ('/Promociones',17, 1),
 ('/Categorias', 11, 1),
 ('/Colores', 10,1),
 ('/Configuraciones',7,1),
 ('/Empleados',14, 1),
  ('/Marcas', 9,1),
 ('/MaterialesZapatos',13,1),
  ('/Tallas',12,1);
  go
	   -- Tabla Marcas
INSERT INTO Marcas (Nombre, DetalleMarca, Estado)
VALUES
  ('Nike', 'Marca especializada en calzado deportivo', 'Activo'),
  ('Adidas', 'Diseño moderno y deportivo', 'Activo'),
  ('Clarks', 'Calidad y comodidad', 'Activo');
go
-- Tabla Colores
INSERT INTO Colores (Color, Estado)
VALUES
  ('Negro', 'Activo'),
  ('Blanco', 'Activo'),
  ('Azul', 'Activo');
  go
-- Tabla Categorias
INSERT INTO Categorias (Nombre, Estado)
VALUES
  ('Deportivos', 'Activo'),
  ('Casuales', 'Activo'),
  ('Formales', 'Activo');
  go
-- Tabla Tallas
INSERT INTO Tallas (NumeroTalla, Estado)
VALUES
  ('36', 'Activo'),
  ('37', 'Activo'),
  ('38', 'Activo');
  go
-- Tabla Materiales para Zapatos
INSERT INTO MaterialesZapatos (Nombre, Descripcion, TipoMaterial, TipodeCostura, TipoSuela, Fabricante, Observaciones, Estado)
VALUES
  ('Cuero Genuino', 'Material duradero y elegante', 'Piel', 'Costura a mano', 'Suela de goma', 'Zapaterías X', 'Ninguna', 'Activo'),
  ('Malla Transpirable', 'Material ligero y transpirable', 'Sintético', 'Costura a máquina', 'Suela de EVA', 'Fabricante Y', 'Ideal para deportes', 'Activo'),
  ('Textil', 'Material cómodo y flexible', 'Textil', 'Costura a máquina', 'Suela de goma', 'Zapaterías Z', 'Adecuado para uso diario', 'Activo');
  go
-- Tabla Productos
INSERT INTO Productos_Zapatos (Nombre, Descripcion, ID_Categoria, Estado)
VALUES
  ('Air Max', 'Zapatillas deportivas con tecnología Air Max', 1, 'Activo'),
  ('Originals Superstar', 'Zapatillas casuales icónicas', 2, 'Activo'),
  ('Unstructured', 'Zapatos formales sin estructura', 3, 'Activo');
  go
  -- Tabla Empleados
INSERT INTO Empleados (Nombre, Apellido, Direccion, Telefono, Estado)
VALUES
  ('Juan', 'Pérez', 'Calle 123, Ciudad ABC', '123-456-7890', 'Activo'),
  ('María', 'Gómez', 'Avenida XYZ, Ciudad DEF', '987-654-3210', 'Activo'),
  ('Carlos', 'Martínez', 'Carrera 456, Ciudad GHI', '111-222-3333', 'Activo');
  go
-- Tabla ZapatosDanados
INSERT INTO ZapatosDanados (ProductoZapatosID, DescripcionDanos, FechaDeteccion, AccionesTomadas, Estado)
VALUES
  (1, 'Rasguño en la parte trasera', '2023-01-15', 'Descuento aplicado al precio de venta', 'Activo'),
  (2, 'Desgaste en la suela', '2023-02-20', 'Enviado a reparación', 'Activo'),
  (3, 'Manchas en la parte superior', '2023-03-10', 'Descartado', 'Inactivo');
  go
-- Tabla Promociones
INSERT INTO Promociones (Nombre, Descripcion, FechaInicio, FechaFin, Estado)
VALUES
  ('Oferta de Verano', 'Descuento del 20% en zapatos de verano', '2023-06-01', '2023-08-31', 'Activo'),
  ('Liquidación Invierno', 'Productos de invierno a precios reducidos', '2023-12-01', '2024-02-28', 'Activo'),
  ('Descuento Especial', 'Solo por hoy, descuento del 30%', '2023-05-01', '2023-05-01', 'Activo');
  go
-- Tabla PRODUCTOS_PROMOCIONES
INSERT INTO PRODUCTOS_PROMOCIONES (ID_ProductoZapatos, ID_Promocion)
VALUES
  (1, 1),
  (2, 2),
  (3, 3);
  go
-- Tabla BODEGA
INSERT INTO BODEGA (NOMBRE, UBICACION, Estado)
VALUES
  ('Bodega Central', 'Calle Principal, Ciudad ABC', 'Activo'),
  ('Sucursal Norte', 'Avenida Norte, Ciudad ABC', 'Activo'),
  ('Sucursal Sur', 'Avenida Sur, Ciudad ABC', 'Activo');
  go
-- Tabla Inventario
INSERT INTO Inventario (ID_BODEGA, ID_ProductoZapatos, ID_Marca, ID_Talla, ID_Colores, ID_MaterialZapatos, UnidadesExistencias, FechaIngreso, PrecioCompra, Descuento, PrecioVenta, ExistenciasMinimas, Estado)
VALUES
  (1, 1, 1, 1, 1, 1, 50, '2023-03-01T10:30:00', 80.00, 10.00, 100.00, 20, 'Activo'),
  (2, 2, 2, 2, 2, 2, 30, '2023-03-10T10:30:00', 120.00, 15.00, 150.00, 15, 'Activo'),
  (3, 3, 3, 3, 3, 3, 40, '2023-03-15T10:30:00', 90.00, 8.00, 110.00, 25, 'Activo');

  go
-- Tabla MovimientosBodegas
INSERT INTO TblMovimientosBodegas (ID_Inventario, PKEmpleado, FechaMovimiento, Descripcion, Cantidad, ID_BODEGA, TipoMovimiento, Estado)
VALUES
  (1, 1, '2023-03-01 10:30:00', 'Entrada de productos nuevos', 30, 1, 'Entrada', 'Activo'),
  (2, 2, '2023-03-05 15:45:00', 'Salida para sucursal sur', 10, 3, 'Salida', 'Activo'),
  (3, 3, '2023-04-01 09:00:00', 'Ajuste de inventario', 5, 2, 'Ajuste', 'Activo');
  go
  CREATE PROCEDURE ActualizarConfiguracion
    @PKConfiguraciones INT,
    @NombreNegocio NVARCHAR(250) = NULL,
    @LogoLocal NVARCHAR(MAX) = NULL,
    @RUC NVARCHAR(20) = NULL,
    @Telefonos NVARCHAR(100) = NULL,
    @Correo NVARCHAR(100) = NULL,
    @Direccion NVARCHAR(255) = NULL,
    @UsuarioModificacion NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TipoOperacion NVARCHAR(20) = 'UPDATE';

    -- Inicializar variables para comparar los valores antiguos y nuevos
    DECLARE @OldNombreNegocio NVARCHAR(250);
    DECLARE @OldLogoLocal NVARCHAR(MAX);
    DECLARE @OldRUC NVARCHAR(20);
    DECLARE @OldTelefonos NVARCHAR(100);
    DECLARE @OldCorreo NVARCHAR(100);
    DECLARE @OldDireccion NVARCHAR(255);

    -- Obtener los valores antiguos antes de la actualización
    SELECT
        @OldNombreNegocio = NombreNegocio,
        @OldLogoLocal = LogoLocal,
        @OldRUC = RUC,
        @OldTelefonos = Telefonos,
        @OldCorreo = Correo,
        @OldDireccion = Direccion
    FROM Configuraciones
    WHERE PKConfiguraciones = @PKConfiguraciones;

    -- Actualizar la tabla Configuraciones
    UPDATE Configuraciones
    SET
        NombreNegocio = ISNULL(@NombreNegocio, NombreNegocio),
        LogoLocal = ISNULL(@LogoLocal, LogoLocal),
        RUC = ISNULL(@RUC, RUC),
        Telefonos = ISNULL(@Telefonos, Telefonos),
        Correo = ISNULL(@Correo, Correo),
        Direccion = ISNULL(@Direccion, Direccion),
        FechaModificacion = GETDATE(),
        UsuarioModificacion = @UsuarioModificacion
    WHERE PKConfiguraciones = @PKConfiguraciones;

    -- Registrar cambios en la tabla HistorialConfiguraciones
    IF @OldNombreNegocio != ISNULL(@NombreNegocio, '') 
        INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
        VALUES (@PKConfiguraciones, 'NombreNegocio', @OldNombreNegocio, ISNULL(@NombreNegocio, ''), GETDATE(), @UsuarioModificacion, @TipoOperacion);

    IF @OldLogoLocal != ISNULL(@LogoLocal, '') 
        INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
        VALUES (@PKConfiguraciones, 'LogoLocal', @OldLogoLocal, ISNULL(@LogoLocal, ''), GETDATE(), @UsuarioModificacion, @TipoOperacion);

    IF @OldRUC != ISNULL(@RUC, '') 
        INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
        VALUES (@PKConfiguraciones, 'RUC', @OldRUC, ISNULL(@RUC, ''), GETDATE(), @UsuarioModificacion, @TipoOperacion);

    IF @OldTelefonos != ISNULL(@Telefonos, '') 
        INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
        VALUES (@PKConfiguraciones, 'Telefonos', @OldTelefonos, ISNULL(@Telefonos, ''), GETDATE(), @UsuarioModificacion, @TipoOperacion);

    IF @OldCorreo != ISNULL(@Correo, '') 
        INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
        VALUES (@PKConfiguraciones, 'Correo', @OldCorreo, ISNULL(@Correo, ''), GETDATE(), @UsuarioModificacion, @TipoOperacion);

    IF @OldDireccion != ISNULL(@Direccion, '') 
        INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, FechaModificacion, UsuarioModificacion, TipoOperacion)
        VALUES (@PKConfiguraciones, 'Direccion', @OldDireccion, ISNULL(@Direccion, ''), GETDATE(), @UsuarioModificacion, @TipoOperacion);
    -- Repite el bloque anterior para cada columna que desees auditar
END;
Go
CREATE PROCEDURE InsertarConfiguracionYHistorial
    @nombreNegocio NVARCHAR(250),
    @logoLocal NVARCHAR(MAX), -- Cambiado a NVARCHAR(MAX)
    @ruc NVARCHAR(20),
    @telefonos NVARCHAR(100),
    @correo NVARCHAR(100),
    @direccion NVARCHAR(255),
    @estado NVARCHAR(50),
    @usuarioModificacion NVARCHAR(50),
    @tipoOperacion NVARCHAR(20)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Insertar en la tabla principal (Configuraciones)
        INSERT INTO Configuraciones (NombreNegocio, LogoLocal, RUC, Telefonos, Correo, Direccion, Estado, UsuarioModificacion, TipoOperacion)
        VALUES (@nombreNegocio, @logoLocal, @ruc, @telefonos, @correo, @direccion, @estado, @usuarioModificacion, @tipoOperacion);

        -- Obtener el ID de la configuración recién insertada
        DECLARE @configuracionID INT;
        SET @configuracionID = SCOPE_IDENTITY();

        -- Insertar en el historial
        INSERT INTO HistorialConfiguraciones (FKConfiguraciones, ColumnaModificada, ValorAntiguo, ValorNuevo, UsuarioModificacion, TipoOperacion)
        VALUES 
            (@configuracionID, 'NombreNegocio','sin Actulizar ', @nombreNegocio, @usuarioModificacion, @tipoOperacion),
            (@configuracionID, 'LogoLocal', 'sin Actulizar ', @logoLocal, @usuarioModificacion, @tipoOperacion),
            (@configuracionID, 'RUC', 'sin Actulizar ', @ruc, @usuarioModificacion, @tipoOperacion),
            (@configuracionID, 'Telefonos', 'sin Actulizar ', @telefonos, @usuarioModificacion, @tipoOperacion),
            (@configuracionID, 'Correo', 'sin Actulizar ', @correo, @usuarioModificacion, @tipoOperacion),
            (@configuracionID, 'Direccion', 'sin Actulizar ', @direccion, @usuarioModificacion, @tipoOperacion),
            (@configuracionID, 'Estado', 'sin Actulizar ', @estado, @usuarioModificacion, @tipoOperacion);

        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
    END CATCH
END;