const express = require('express');
const { initializeDatabase } = require('./db');

const app = express();

app.use(express.json());

async function startServer() {
    try {
        const pool = await initializeDatabase();
        //2
        app.post('/newProduct', async (req, res) => {
            const { name, price, stockQuantity, SupplierID } = req.body;
            try {
                const query = 'INSERT INTO Products (productName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)';
                const [result] = await pool.execute(query, [name, price, stockQuantity, SupplierID]);
                res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
            } catch (error) {
                console.error('Error adding product:', error.message);
                res.status(500).json({ message: 'Error adding product' });
            }
        });

        app.get('/products', async (req, res) => {
            try {
                const query = 'SELECT * FROM Products';
                const [rows] = await pool.execute(query);
                res.status(200).json(rows);
            } catch (error) {
                console.error('Error fetching products:', error.message);
                res.status(500).json({ message: 'Error fetching products' });
            }
        });
        app.get('/products/:id', async (req, res) => {
            const productId = req.params.id;
            try {
                const query = 'SELECT * FROM Products WHERE productID = ?';
                const [rows] = await pool.execute(query, [productId]);
                if (rows.length === 0) {
                    res.status(404).json({ message: 'Product not found' });
                } else {
                    res.status(200).json(rows[0]);
                }
            } catch (error) {
                console.error('Error fetching product:', error.message);
                res.status(500).json({ message: 'Error fetching product' });
            }
        });

        app.patch('/products/:id', async (req, res) => {
            const productId = req.params.id;
            const { name, price, stockQuantity, SupplierID } = req.body;

            try {
                const query = 'UPDATE Products SET productName = ?, Price = ?, StockQuantity = ?, SupplierID = ? WHERE productID = ?';
                const [result] = await pool.execute(query, [name, price, stockQuantity, SupplierID, productId]);
                if (result.affectedRows === 0) {
                    res.status(404).json({ message: 'Product not found' });
                } else {
                    res.status(200).json({ message: 'Product updated successfully' });
                }
            } catch (error) {
                console.error('Error updating product:', error.message);
                res.status(500).json({ message: 'Error updating product' });
            }
        });

        app.delete('/products/:id', async (req, res) => {
            const productId = req.params.id;
            try {
                const query = 'DELETE FROM Products WHERE productID = ?';
                const [result] = await pool.execute(query, [productId]);
                if (result.affectedRows === 0) {
                    res.status(404).json({ message: 'Product not found' });
                } else {
                    res.status(200).json({ message: 'Product deleted successfully' });
                }
            } catch (error) {
                console.error('Error deleting product:', error.message);
                res.status(500).json({ message: 'Error deleting product' });
            }
        });

        //3
        app.post('/newSupplier', async (req, res) => {
            const { name, contactNumber } = req.body;
            try {
                const query = 'INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)';
                const [result] = await pool.execute(query, [name, contactNumber]);
                res.status(201).json({ message: 'Supplier added successfully', supplierId: result.insertId });
            } catch (error) {
                console.error('Error adding supplier:', error.message);
                res.status(500).json({ message: 'Error adding supplier' });
            }
        });

        app.get('/suppliers', async (req, res) => {
            try {
                const query = 'SELECT * FROM Suppliers';
                const [rows] = await pool.execute(query);
                res.status(200).json(rows);
            } catch (error) {
                console.error('Error fetching suppliers:', error.message);
                res.status(500).json({ message: 'Error fetching suppliers' });
            }
        });

        app.patch('/suppliers/:id', async (req, res) => {
            const supplierId = req.params.id;
            const { name, contactNumber } = req.body;
            try {
                const query = 'UPDATE Suppliers SET SupplierName = ?, ContactNumber = ? WHERE SupplierID = ?';
                const [result] = await pool.execute(query, [name, contactNumber, supplierId]);
                if (result.affectedRows === 0) {
                    res.status(404).json({ message: 'Supplier not found' });
                } else {
                    res.status(200).json({ message: 'Supplier updated successfully' });
                }
            } catch (error) {
                console.error('Error updating supplier:', error.message);
                res.status(500).json({ message: 'Error updating supplier' });
            }
        });
        app.delete('/suppliers/:id', async (req, res) => {
            const supplierId = req.params.id;
            try {
                const query = 'DELETE FROM Suppliers WHERE SupplierID = ?';
                const [result] = await pool.execute(query, [supplierId]);
                if (result.affectedRows === 0) {
                    res.status(404).json({ message: 'Supplier not found' });
                } else {
                    res.status(200).json({ message: 'Supplier deleted successfully' });
                }
            } catch (error) {
                console.error('Error deleting supplier:', error.message);
                res.status(500).json({ message: 'Error deleting supplier' });
            }
        });

        //4
        app.post('/newSale', async (req, res) => {
            const { productID, quantitySold, saleDate } = req.body;
            try {
                const query = 'INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)';
                const [result] = await pool.execute(query, [productID, quantitySold, saleDate]);
                res.status(201).json({ message: 'Sale added successfully', saleId: result.insertId });
            } catch (error) {
                console.error('Error adding sale:', error.message);
                res.status(500).json({ message: 'Error adding sale' });
            }
        });

        app.get('/sales', async (req, res) => {
            try {
                const [rows] = await pool.execute('SELECT * FROM Sales');
                res.json(rows);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        app.patch('/sales/:id', async (req, res) => {
            const saleId = req.params.id;
            const { productID, quantitySold, saleDate } = req.body;
            try {
                const query = 'UPDATE Sales SET ProductID = ?, QuantitySold = ?, SaleDate = ? WHERE SaleID = ?';
                const [result] = await pool.execute(query, [productID, quantitySold, saleDate, saleId]);
                if (result.affectedRows === 0) {
                    res.status(404).json({ message: 'Sale not found' });
                } else {
                    res.status(200).json({ message: 'Sale updated successfully' });
                }
            } catch (error) {
                console.error('Error updating sale:', error.message);
                res.status(500).json({ message: 'Error updating sale' });
            }
        });
        app.get('/sales/:productId', async (req, res) => {
            const productId = req.params.productId;
            try {
                const query = 'SELECT * FROM Sales WHERE ProductID = ?';
                const [results] = await pool.execute(query, [productId]);
                res.status(200).json(results);
            } catch (error) {
                console.error('Error fetching sales:', error.message);
                res.status(500).json({ message: 'Error fetching sales' });
            }
        });
        //5
        app.post('/addCategory', async (req, res) => {
            try {
                const query = `
            ALTER TABLE Products
            ADD COLUMN Category VARCHAR(50)
        `;

                await pool.execute(query);

                res.status(201).json({
                    message: 'Category column added successfully'
                });
            } catch (error) {
                console.error('Error adding Category:', error.message);
                res.status(500).json({
                    message: 'Error adding Category'
                });
            }
        });

        app.delete('/deleteCategory', async (req, res) => {
            try {
                const query = `
            ALTER TABLE Products
            DROP COLUMN Category
        `;

                await pool.execute(query);

                res.status(200).json({
                    message: 'Category column deleted successfully'
                });
            } catch (error) {
                console.error('Error deleting Category:', error.message);
                res.status(500).json({
                    message: 'Error deleting Category'
                });
            }
        });
        app.patch('/changeContactNumberType', async (req, res) => {
            try {
                const query = `
            ALTER TABLE Suppliers
            MODIFY COLUMN ContactNumber VARCHAR(15)
        `;

                await pool.execute(query);

                res.status(200).json({
                    message: 'ContactNumber type changed successfully'
                });
            } catch (error) {
                console.error('Error changing ContactNumber:', error.message);
                res.status(500).json({
                    message: 'Error changing ContactNumber type'
                });
            }
        });
        app.patch('/addProductNameConstraint', async (req, res) => {
            try {
                const query = `
            ALTER TABLE Products
            MODIFY COLUMN ProductName VARCHAR(100) NOT NULL
        `;

                await pool.execute(query);

                res.status(200).json({
                    message: 'NOT NULL constraint added successfully'
                });
            } catch (error) {
                console.error('Error adding constraint:', error.message);
                res.status(500).json({
                    message: 'Error adding constraint'
                });
            }
        });

        //6
        app.post('/insertData', async (req, res) => {
            try {
                const [supplier] = await pool.execute(
                    'INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)',
                    ['FreshFoods', '01001234567']
                );

                const supplierId = supplier.insertId;

                const [milk] = await pool.execute(
                    'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)',
                    ['Milk', 15, 50, supplierId]
                );

                await pool.execute(
                    `INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
             VALUES (?, ?, ?, ?), (?, ?, ?, ?)`,
                    ['Bread', 10, 30, supplierId, 'Eggs', 20, 40, supplierId]
                );

                await pool.execute(
                    'INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)',
                    [milk.insertId, 2, '2025-05-20']
                );

                res.status(201).json({ message: 'Data inserted successfully' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });

        //7
        app.patch('/updateBread', async (req, res) => {
            try {
                await pool.execute(
                    `UPDATE Products SET Price = ? WHERE ProductName = ?`,
                    [25.00, 'Bread']
                );

                res.json({ message: 'Bread price updated' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        //8
        app.delete('/deleteEggs', async (req, res) => {
            try {
                await pool.execute(
                    `DELETE FROM Products WHERE ProductName = ?`,
                    ['Eggs']
                );

                res.json({ message: 'Eggs deleted' });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });

        //9
        app.get('/totalSold', async (req, res) => {
            try {
                const [rows] = await pool.execute(`
            SELECT p.ProductName,
                   COALESCE(SUM(s.QuantitySold), 0) AS TotalSold
            FROM Products p
            LEFT JOIN Sales s ON p.ProductID = s.ProductID
            GROUP BY p.ProductID, p.ProductName
        `);

                res.json(rows);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });

        //10
        app.get('/highestStock', async (req, res) => {
            try {
                const [rows] = await pool.execute(`
            SELECT * FROM Products
            ORDER BY StockQuantity DESC
            LIMIT 1
        `);

                res.json(rows);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });

        //11
        app.get('/suppliersF', async (req, res) => {
            try {
                const [rows] = await pool.execute(`
            SELECT * FROM Suppliers
            WHERE SupplierName LIKE 'F%'
        `);

                res.json(rows);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        //12
        app.get('/neverSold', async (req, res) => {
            try {
                const [rows] = await pool.execute(`
            SELECT p.*
            FROM Products p
            LEFT JOIN Sales s ON p.ProductID = s.ProductID
            WHERE s.ProductID IS NULL
        `);

                res.json(rows);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });

        //13
        app.get('/salesReport', async (req, res) => {
            try {
                const [rows] = await pool.execute(`
            SELECT p.ProductName, s.QuantitySold, s.SaleDate
            FROM Sales s
            JOIN Products p ON s.ProductID = p.ProductID
        `);

                res.json(rows);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });


        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });

    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }


}

startServer();
