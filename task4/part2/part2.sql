CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL
) 

CREATE TABLE User_Phone (
    userId INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    PRIMARY KEY (userId, phone),
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
) 

CREATE TABLE Product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id)
) 