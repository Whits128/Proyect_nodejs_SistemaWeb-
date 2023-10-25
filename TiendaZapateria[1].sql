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
go
-- Tabla de Usuarios
CREATE TABLE USUARIO (
    IdUsuario INT PRIMARY KEY IDENTITY(1,1),
    Nombres VARCHAR(100),
    Apellidos VARCHAR(100),
    LoginUsuario VARCHAR(50),
    LoginClave VARCHAR(100),
	IdRol int references Roles(IdRol),
    Activo BIT DEFAULT 1,
    FechaRegistro DATETIME DEFAULT GETDATE()
);

go
-- Tabla de Recursos (páginas o funcionalidades)
CREATE TABLE Recursos (
    IdRecurso INT PRIMARY KEY IDENTITY(1,1),
    NombreRecurso NVARCHAR(100) UNIQUE NOT NULL
);
go
-- Tabla de Permisos (asignación de roles a recursos)
CREATE TABLE Permisos (
    IdPermiso INT PRIMARY KEY IDENTITY(1,1),
    IdRol INT FOREIGN KEY REFERENCES Roles(IdRol),
    IdRecurso INT FOREIGN KEY REFERENCES Recursos(IdRecurso)
);


GO

-- Tabla Configuraciones
CREATE TABLE Configuraciones (
    PKConfiguraciones INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    NombreNegocio NVARCHAR(250) NOT NULL,
    Banner NVARCHAR(450) NOT NULL,
    RUC NVARCHAR(150) NOT NULL,
    Telefonos NVARCHAR(450) NOT NULL,
    Correo NVARCHAR(150) NOT NULL,
    Direccion NVARCHAR(450) NOT NULL
);
GO

-- Tabla Marcas
CREATE TABLE Marcas (
    ID_Marca INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(100),
    DetalleMarca VARCHAR(100),
    Estado BIT DEFAULT 1
);
GO

-- Tabla Colores
CREATE TABLE Colores (
    ID_Colores INT PRIMARY KEY IDENTITY(1,1),
    Color VARCHAR(255),
    Estado BIT DEFAULT 1
);
GO

-- Tabla Categorias
CREATE TABLE Categorias (
    ID_Categoria INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(100),
    Estado BIT DEFAULT 1
);
GO

-- Tabla Tallas
CREATE TABLE Tallas (
    ID_Talla INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(10),
    Estado BIT DEFAULT 1
);
GO

-- Tabla Materiales para Zapatos
CREATE TABLE MaterialesZapatos (
    ID_MaterialZapatos INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100),
    Descripcion TEXT,
    TipoMaterial VARCHAR(50),
    Fabricante VARCHAR(100),
    Categoria VARCHAR(50),
    Observaciones TEXT,
    Estado BIT DEFAULT 1
);
GO

-- Tabla Productos
CREATE TABLE Productos_Zapatos (
    ID_ProductoZapatos INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100),
    Descripcion NVARCHAR(MAX),
    ID_Categoria INT FOREIGN KEY REFERENCES Categorias(ID_Categoria),
    Estado BIT DEFAULT 1
);
GO

-- Tabla Empleados
CREATE TABLE Empleados (
    ID_Empleado INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100),
    Apellido VARCHAR(100),
    Direccion VARCHAR(200),
    Telefono VARCHAR(20),
    Estado BIT DEFAULT 1
);
GO

-- Tabla de Zapatos Dañados
CREATE TABLE ZapatosDanados (
    ID_ZapatoDanado INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
    ID_ProductoZapatos INT FOREIGN KEY REFERENCES Productos_Zapatos(ID_ProductoZapatos),
    DescripcionDanos TEXT,
    FechaDeteccion DATE,
    AccionesTomadas TEXT,
    Estado BIT DEFAULT 1
);
GO

-- Tabla Promociones
CREATE TABLE Promociones (
    ID_Promocion INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100),
    Descripcion VARCHAR(200),
    FechaInicio DATE,
    FechaFin DATE,
    ID_ProductoZapatos INT FOREIGN KEY REFERENCES Productos_Zapatos(ID_ProductoZapatos),
    Estado BIT DEFAULT 1
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
    NOMBRE VARCHAR(100),
    UBICACION VARCHAR(100),
    ESTADO BIT DEFAULT 1
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
    ESTADO BIT DEFAULT 1
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
    E0stadoMovimiento BIT NOT NULL
);
GO
-- Tabla Ventas
CREATE TABLE Ventas (
    ID_Venta INT PRIMARY KEY IDENTITY(1,1),
    Total DECIMAL(10, 2),
    Fecha DATE,
	Estado BIT DEFAULT 1 -- 1: Activa, 0: Anulada
);
GO

-- Tabla DetalleVenta
CREATE TABLE DetalleVenta (
    ID_DetalleVenta INT PRIMARY KEY IDENTITY(1,1),
    ID_Inventario INT FOREIGN KEY REFERENCES Inventario(ID_Inventario) NOT NULL,
    ID_Promocion INT FOREIGN KEY REFERENCES Promociones(ID_Promocion),
    ID_Empleado INT FOREIGN KEY REFERENCES Empleados(ID_Empleado),
    Cantidad INT,
    Descuento DECIMAL(10, 2),
    Total DECIMAL(10, 2),
    Subtotal DECIMAL(10, 2),
    IVA DECIMAL(10, 2),
    Fecha DATE,
	Estado BIT DEFAULT 1 -- 1: Activa, 0: Anulada
);
GO

-- Tabla Proveedores
CREATE TABLE Proveedores (
    ID_Proveedor INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100),
    Direccion VARCHAR(200),
    Telefono VARCHAR(20),
    Ruc NVARCHAR(100) NULL,
    DireccionProveedor NVARCHAR(650) NOT NULL,
    Departamento NVARCHAR(100) NULL,
    Municipio NVARCHAR(100) NULL,
    EmailProveedor NVARCHAR(200) NOT NULL,
    Estado BIT DEFAULT 1
);
GO

-- Tabla Compras
CREATE TABLE Compras (
    ID_Compra INT PRIMARY KEY IDENTITY(1,1),
    FechaCompra DATETIME NOT NULL,
    Total DECIMAL(10, 2),
    Estado BIT DEFAULT 1
);
GO

-- Tabla Facturas
CREATE TABLE Facturas (
    ID_Factura INT PRIMARY KEY IDENTITY(1,1),
    Fecha DATE,
    Total DECIMAL(10, 2)
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
    Descuento DECIMAL(10, 2)
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
    IVA DECIMAL(10, 2)
);
GO



-- Tabla Devoluciones
CREATE TABLE Devoluciones (
    ID_Devolucion INT PRIMARY KEY IDENTITY(1,1),
    ID_Venta INT FOREIGN KEY REFERENCES Ventas(ID_Venta),
    ID_ProductoZapatos INT FOREIGN KEY REFERENCES Productos_Zapatos(ID_ProductoZapatos),
    Cantidad INT,
    Motivo VARCHAR(200),
    Fecha DATE,
    Estado BIT DEFAULT 1
);
GO
