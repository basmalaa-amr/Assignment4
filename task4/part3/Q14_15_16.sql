--Q14
 CREATE USER 'store_manager'@'localhost'
 IDENTIFIED BY 'Password';
 GRANT SELECT, INSERT, UPDATE
 ON store_db.*
 TO 'store_manager'@'localhost';

--Q15
 REVOKE UPDATE
 ON store_db.*
 FROM 'store_manager'@'localhost';

--Q16
 GRANT DELETE
 ON store_db.Sales
 TO 'store_manager'@'localhost';