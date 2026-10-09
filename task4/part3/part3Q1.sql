CREATE TABLE Products(
    productID INT AUTO_INCREMENT PRIMARY KEY,
    productName TEXT NOT NULL,
    Price   DECIMAL(10, 2) NOT NULL,
    StockQuantity INT NOT NULL,
    SupplierID INT,
    FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
);

CREATE TABLE Suppliers(
    SupplierID INT AUTO_INCREMENT PRIMARY KEY,
    SupplierName TEXT NOT NULL,
    ContactNumber  TEXT NOT NULL
);

CREATE TABLE Sales(
    SaleID INT AUTO_INCREMENT PRIMARY KEY,
    productID INT,
    QuantitySold INT NOT NULL,
    SaleDate DATE NOT NULL,
    FOREIGN KEY (productID) REFERENCES Products(productID)
);