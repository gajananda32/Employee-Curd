const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const path = require('path');
dotenv.config();
const PORT = process.env.PORT || 9000 ;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const db = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('MYSQL Connected...');
    }
});

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



  
  // Create table
  const createTableQuery = `CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    position VARCHAR(255),
    office VARCHAR(255),
    salary DECIMAL(10, 2)
  )`;
  
  db.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Table created');
  });

  app.post('/api/addemployee', (req, res) => {

    try {
        let reqBody = JSON.parse(JSON.stringify(req.body));
        let details = {
            name: reqBody.name,
            position: reqBody.position,
            office: reqBody.office,
            salary: reqBody.salary
        }
        let query = 'INSERT INTO employees SET ?';
        db.query(query, details, (err, result) => {
            if (err){
                console.log("🚀 ~ db.query ~ err:", err)
                res.send({status: 400, message: 'Error in adding employee'})
            }else{
                res.send({status: 200, message: 'Employee added successfully',data: details})
            }
        });       
        
    } catch (error) {
        console.log("🚀 ~ app.post ~ error:", error)
        
    }
  });

    app.get('/api/getemployees', (req, res) => {
        try {
          console.log("🚀 ~ app.get ~ req", req.body)
            let query = 'SELECT * FROM employees';
            db.query(query, (err
                , result) => {
                if (err){
                    res.send({status: 400, message: 'Error in fetching employees'})
                }else{
                    res.send({status: 200, message: 'Employees fetched successfully',data: result})
                }
            }
            );
            
        } catch (error) {
            console.log("🚀 ~ error:", error)
            
        }
    });

    app.get('/api/getemployee/:id', (req, res) => {
        try {
            let id = req.params.id;
            let query = 'SELECT * FROM employees WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) {
                    res.status(400).send({ status: 400, message: 'Error in fetching employee' });
                } else {
                    if (result.length === 0) {
                        res.status(404).send({ status: 404, message: 'Employee not found' });
                    } else {
                        res.status(200).send({ status: 200, message: 'Employee fetched successfully', data: result });
                    }
                }
            });
        } catch (error) {
            console.log("🚀 ~ error:", error);
            res.status(500).send({ status: 500, message: 'Internal server error' });
        }
    });
    

    app.put('/api/updateemployee/:id', (req, res) => {
        try {
            let id = req.params.id;
            let reqBody = JSON.parse(JSON.stringify(req.body));
            let details = {
                name: reqBody.name,
                position: reqBody.position,
                office: reqBody.office,
                salary: reqBody.salary
            }
            let query = 'UPDATE employees SET ? WHERE id = ?';
            db.query(query, [details, id], (err, result) => {
                if (err) {
                    res.status(400).send({ status: 400, message: 'Error in updating employee' });
                } else {
                    res.status(200).send({ status: 200, message: 'Employee updated successfully', data: details });
                }
            });
        } catch (error) {
            console.log("🚀 ~ error:", error);
            res.status(500).send({ status: 500, message: 'Internal server error' });
        }
    }
    );

    app.delete('/api/deleteemployee/:id', (req, res) => {
        try {
            let id = req.params.id;
            let query = 'DELETE FROM employees WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) {
                    res.status(400).send({ status: 400, message: 'Error in deleting employee' });
                } else {
                    res.status(200).send({ status: 200, message: 'Employee deleted successfully' });
                }
            });
        } catch (error) {
            console.log("🚀 ~ error:", error);
            res.status(500).send({ status: 500, message: 'Internal server error' });
        }
    }
    );

    app.get('/api/searchemployee/:name', (req, res) => {
        try {
            let name = req.params.name;
            let query = 'SELECT * FROM employees WHERE name LIKE ?';
            db.query(query, [name], (err, result) => {
                if (err) {
                    res.status(400).send({ status: 400, message: 'Error in searching employee' });
                } else {
                    if (result.length === 0) {
                        res.status(404).send({ status: 404, message: 'Employee not found' });
                    } else {
                        res.status(200).send({ status: 200, message: 'Employee found successfully', data: result });
                    }
                }
            });
        } catch (error) {
            console.log("🚀 ~ error:", error);
            res.status(500).send({ status: 500, message: 'Internal server error' });
        }
    }
    );

    // delete all employees
app.delete('/api/deleteemployees', (req, res) => {
    try {
        let query = 'DELETE FROM employees';
        db.query(query, (err
            , result) => {
            if (err){
                res.send({status: 400, message: 'Error in deleting employees'})
            }else{
                res.send({status: 200, message: 'Employees deleted successfully'})
            }
        }
        );

    } catch (error) {
        console.log("🚀 ~ error:", error)
        res.status(500).send({ status: 500, message: 'Internal server error' });
    }
}
);
    