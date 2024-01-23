const http = require('http');
const mysql = require('mysql2');
const cors = require('cors');

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "login"
});

function getLoginAndPassword(sessionID) {
  return new Promise((resolve, reject) => {
    const query = `SELECT login, password FROM sessions WHERE ID = ${sessionID}`;
    connection.query(query, [sessionID], (err, results) => {
      if (err) {
        console.error('Помилка виконання запиту: ', err);
        reject(err);
      } else {
        if (results.length > 0) {
          const login = results[0].login;
          const password = results[0].password;
          resolve({ login, password });
        } else {
          reject(new Error('Сесія не знайдена або вичерпано час дії сесії.'));
        }
      }
    });
  });
}

// Require express
const express = require("express");
const { resolve } = require('path');
// Initialize express
const app = express();
const PORT = 8080;
// parse JSON
app.use(express.json());
// parse URL encoded data
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*'
}));

app.get('/', (req, res) => {
  res.send('Hello World, from express');
});
// Отримання dropdown
app.get('/dropdown', (req, res) => {
  const table = req.query.table; // Отримання параметра table з URL-запиту
  const fors = req.query.for;
  const query = `SELECT ID, Назва FROM \`${table}\``; // Запит для отримання ID та назви з іншої таблиці
  const sessionID = req.query.session;
  getLoginAndPassword(sessionID)
  .then(({ login, password }) => {
    var con = mysql.createConnection({
      host: "localhost",
      user: login,
      password: password,
      database: "energy_complex"
    });
    con.query(query, (err, results) => {
      if (err) {
        console.error('Помилка виконання запиту: ', err);
        res.status(500).send('Помилка сервера');
        con.end();
        return;
      } else {
        let options = '';

        results.forEach((row) => {
          const optionValue = row.ID;
          const optionText = row['Назва'];
          options += `<option data-for='${optionText}' value="${optionValue}">${optionValue} - ${optionText}</option>`;
        });

        const selectHTML = `<select name="${fors}">${options}</select>`;

        res.json({html:selectHTML});
      }
      con.end(); // Закриття з'єднання після виконання запиту
    });
  });
});
// Маршрут для отримання назв стовпців і контенту таблиці
app.get('/table', (req, res) => {
  const table = req.query.table; // Отримання параметра table з URL-запиту
  const sortBy = req.query.by;
  const sortDirection = req.query.sort;
  const query = `DESCRIBE \`${table}\``; // Запит для отримання опису стовпців таблиці
  const sessionID = req.query.session;
  getLoginAndPassword(sessionID)
  .then(({ login, password }) => {
    var con = mysql.createConnection({
      host: "localhost",
      user: login,
      password: password,
      database: "energy_complex"
    });

    con.query(query, (err, results) => {
      if (err) {
        console.error('Помилка виконання запиту: ', err);
        res.status(500).send('Помилка сервера');
        con.end();
        return;
      } else {
        const columns = results.map((row) => ({
          name: row.Field,
          type: row.Type,
        }));
        let selectQuery;
        switch(table){
          case "Енергетичні підприємства":
            selectQuery = `SELECT E.ID, E.Назва, E.Адреса, T.Назва AS Тип
            FROM \`Енергетичні підприємства\` E
            JOIN \`Типи підприємств\` T ON E.Тип = T.ID
            ORDER BY \`${sortBy ? sortBy : "ID"}\` ${sortDirection ? sortDirection : "ASC"}`;
          break;
          case "Обладнання":
            selectQuery = `SELECT O.ID, O.Назва, O.Тип, E.Назва AS Підприємство, P.Назва AS Постачальник
            FROM \`Обладнання\` O
            JOIN \`Енергетичні підприємства\` E ON O.Підприємство = E.ID
            JOIN \`Постачальники обладнання\` P ON O.Постачальник = P.ID
            ORDER BY \`${sortBy ? sortBy : "ID"}\` ${sortDirection ? sortDirection : "ASC"}`;
          break;
          case "Енергопостачання":
            selectQuery = `SELECT EP.ID, EP.Дата, E.Назва AS Підприємство, ER.Назва AS Енергоресурс, EP.Обсяг
            FROM \`Енергопостачання\` EP
            JOIN \`Енергетичні підприємства\` E ON EP.Підприємство = E.ID
            JOIN \`Енергоресурси\` ER ON EP.Енергоресурс = ER.ID
            ORDER BY \`${sortBy ? sortBy : "ID"}\` ${sortDirection ? sortDirection : "ASC"}`;
          break;
          default:
            selectQuery = `SELECT * FROM \`${table}\` ORDER BY \`${sortBy ? sortBy : "ID"}\` ${sortDirection ? sortDirection : "ASC"}`; // Запит для отримання контенту таблиці
          break;
        }
        

        con.query(selectQuery, (err, results) => {
          if (err) {
            console.error('Помилка виконання запиту: ', err);
            res.status(500).send('Помилка сервера');
            con.end();
            return;
          } else {
            const content = results.map((row) => Object.values(row));

            const response = {
              columns: columns,
              content: content,
            };

            res.json(response);
          }
          con.end(); // Закриття з'єднання після виконання запиту
        });
      }
    });
    
  });
}); 
// Кастомний sql
app.get('/sql', (req, res) => {
  const sortBy = req.query.by;
  const sortDirection = req.query.sort;
  const query = req.query.query;
  const sessionID = req.query.session;
  getLoginAndPassword(sessionID)
  .then(({ login, password }) => {
    const con = mysql.createConnection({
      host: "localhost",
      user: login,
      password: password,
      database: "energy_complex"
    });
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "energy_complex"
    });
    // Створення VIEW з переданого запиту
    const viewName = `temp_view_${Date.now()}`; // Генеруємо унікальне ім'я для VIEW
    const createViewQuery = `CREATE VIEW ${viewName} AS ${query}`;

    connection.query(createViewQuery, (createViewErr) => {
      if (createViewErr) {
        console.error('Помилка створення VIEW: ', createViewErr);
        res.status(500).send('Помилка сервера');
        
        connection.end();
        return;
      }
      
      // Отримання інформації про типи стовпців з VIEW
      const describeQuery = `DESCRIBE ${viewName}`;
      con.query(describeQuery, (describeErr, describeResult) => {
        if (describeErr) {
          console.error('Помилка отримання типів стовпців: ', describeErr);
          res.status(500).send('Помилка сервера');
          con.end();
          // Видалення VIEW
          console.log(`view try ${viewName} deleted`);
          const dropViewQuery = `DROP VIEW ${viewName}`;
          connection.query(dropViewQuery, (dropErr) => {
            if (dropErr) {
              console.error('Помилка видалення VIEW: ', dropErr);
              res.status(500).send('Помилка сервера');
              connection.end();
              return;
            }
          });
          return;
        }
        
        const columns = describeResult.map((row) => ({
          name: row.Field,
          type: row.Type,
        }));
        
        // Отримання контенту з VIEW
        const selectQuery = `SELECT * FROM ${viewName} ${sortBy ? `ORDER BY \`${sortBy ? sortBy : "ID"}\` ${sortDirection ? sortDirection : "ASC"}` : ""} `;
        con.query(selectQuery, (selectErr, selectResult) => {
          if (selectErr) {
            console.error('Помилка отримання контенту: ', selectErr);
            res.status(500).send('Помилка сервера');
            const dropViewQuery = `DROP VIEW ${viewName}`;
            connection.query(dropViewQuery, (dropErr) => {
              if (dropErr) {
                console.error('Помилка видалення VIEW: ', dropErr);
                res.status(500).send('Помилка сервера');
                connection.end();
                return;
              }
          });
            con.end();
            return;
          }
          
          const content = selectResult.map((row) => Object.values(row));
          
          // Видалення VIEW
          const dropViewQuery = `DROP VIEW ${viewName}`;
          console.log(`view try ${viewName} deleted`);
          connection.query(dropViewQuery, (dropErr) => {
            if (dropErr) {т
              console.error('Помилка видалення VIEW: ', dropErr);
              res.status(500).send('Помилка сервера');
              connection.end();
              return;
            }
            
            const response = {
              columns: columns,
              content: content,
            };
            
            res.json(response);
            con.end(); // Закриття з'єднання після виконання запиту
          });
        });
      });
    });
    
  })
  .catch(error => {
    console.error('Помилка отримання логіну та паролю: ', error);
    res.status(500).send('Помилка сервера');
  });
});


//Отримання усіх таблиць
app.get('/tables', (req, res) => {
  const query = `SHOW TABLES`;
  const sessionID = req.query.session;
  getLoginAndPassword(sessionID)
  .then(({ login, password }) => {
    var con = mysql.createConnection({
      host: "localhost",
      user: login,
      password: password,
      database: "energy_complex"
    });
    con.query(query, (err, results) => {
      if (err) {
        console.error('Помилка виконання запиту: ', err);
        res.status(500).send('Помилка сервера');
        
      } else {
        const tables = results.map((row) => row[`Tables_in_${con.config.database}`]);
        res.json(tables);
      }
      con.end(); // Закриття з'єднання після виконання запиту
    });
  });
});

// Додавання записів у таблицю
app.post('/add', (req, res) => {
  const table = req.query.table; // Отримання параметра table з URL-запиту
  const into = req.query.into;
  const content = req.query.content;

  const query = `INSERT INTO \`${table}\` ${into} VALUES ${content};`;

  const sessionID = req.query.session;
  getLoginAndPassword(sessionID)
  .then(({ login, password }) => {
    var con = mysql.createConnection({
      host: "localhost",
      user: login,
      password: password,
      database: "energy_complex"
    });
    con.query(query, content, (err, result) => {
      if (err) {
        console.error('Помилка виконання запиту: ', err);
        res.status(500).json({ error: 'Помилка при додаванні запису ', err: err });
      } else {
        res.json({ success: true, message: 'Запис додано до таблиці.' });
      }
      con.end(); // Закриття з'єднання після виконання запиту
    });
  });
}); 

// Маршрут для зміни таблиці
app.post('/update', (req, res) => {
  const table = req.query.table; // Отримання параметра table з URL-запиту
  const id = req.query.id; // Отримання параметра id з URL-запиту
  const content = req.query.content; // Отримання параметра values з URL-запиту

  const query = `UPDATE \`${table}\` SET ${content} WHERE ID = ${id}`;
  const sessionID = req.query.session;
  getLoginAndPassword(sessionID)
  .then(({ login, password }) => {
    var con = mysql.createConnection({
      host: "localhost",
      user: login,
      password: password,
      database: "energy_complex"
    });
    con.query(query, (err, result) => {
      if (err) {
        console.error('Помилка виконання запиту: ', err);
        res.status(500).json({ error: 'Помилка при додаванні запису ', err: err });
      } else {
        res.json({ success: true, message: 'Таблицю змінено.' });
      }
      con.end(); // Закриття з'єднання після виконання запиту
    });
  });
});

// Маршрут для видалення у таблицях 
app.delete('/delete', (req, res) => {
  const table = req.query.table; // Отримання параметра table з URL-запиту
  const id = req.query.id; // Отримання параметра id з URL-запиту

  const query = `DELETE FROM \`${table}\` WHERE ID = ${id}`;
  const sessionID = req.query.session;
  getLoginAndPassword(sessionID)
  .then(({ login, password }) => {
    var con = mysql.createConnection({
      host: "localhost",
      user: login,
      password: password,
      database: "energy_complex"
    });
    con.query(query, (err, result) => {
      if (err) {
        console.error('Помилка виконання запиту: ', err);
        res.status(500).json({ error: 'Помилка при додаванні запису ', err: err });
      } else {
        res.json({ success: true, message: 'Таблицю змінено.' });
      }
      con.end(); // Закриття з'єднання після виконання запиту
    });
  });
});


// Перевірка доступності підключення до MySQL
function checkMySQLConnection(dbConfig,callback) {
  const connection = mysql.createConnection(dbConfig);
  connection.connect((err) => {
    if (err) {
      console.error('Помилка при підключенні до MySQL:', err);
      callback(err);
    } else {
      console.log('Підключення до MySQL успішне');
      callback(null);
    }
    connection.end();
  });
}
//вхід
// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'login'
});

// Route for adding a new session
app.post('/sessions', (req, res) => {
  const { login, password } = req.body;
  checkMySQLConnection({
    host: 'localhost',
    user: login,
    password: password,
    database: 'login'
  },(err) => {
      if (err) {
        res.status(500).json({ error: 'Помилка при вході в аккаунт' });
      } else {
        // Insert a new session into the sessions table
        pool.query('INSERT INTO sessions (login, password) VALUES (?, ?)', [login, password], (error, results) => {
        if (error) {
            console.error('Помилка при додаванні запису: ', error);
            res.status(500).send('Помилка сервера');
        } else {
            // Get the ID of the newly inserted session
            const sessionId = results.insertId;
            res.json({ sessionId });
        }
        });
      }
  });
});

//Отримання усіх таблиць  та кількість записів
app.get('/tables/count', (req, res) => {
  const tablesQuery = 'SHOW TABLES';
  const sessionID = req.query.session;
  getLoginAndPassword(sessionID)
  .then(({ login, password }) => {
    var con = mysql.createConnection({
      host: "localhost",
      user: login,
      password: password,
      database: "energy_complex"
    });
    con.query(tablesQuery, (error, results) => {
      if (error) {
        console.error('Помилка отримання списку таблиць: ', error);
        res.status(500).send('Помилка сервера');
        con.end();
        return;
      }
      const tables = results.map((row) => Object.values(row)[0]);
      const tableStats = [];
      // Функція для отримання кількості записів у кожній таблиці
      const getTableRecordCount = (table) => {
        return new Promise((resolve, reject) => {
          const countQuery = `SELECT COUNT(*) AS count FROM \`${table}\``;
  
          con.query(countQuery, (error, results) => {
            if (error) {
              reject(error);
              return;
            }
            const count = results[0].count;
            resolve({ table, count });
          });
        });
      };
      // Послідовно виконуємо запити для отримання кількості записів у кожній таблиці
      const fetchTableStats = async () => {
        for (const table of tables) {
          try {
            const stats = await getTableRecordCount(table);
            tableStats.push(stats);
          } catch (error) {
            console.error(`Помилка отримання кількості записів у таблиці ${table}: `, error);
          }
        }
        
        // Повертаємо результат зі списком таблиць та кількістю записів
        res.json(tableStats);
        con.end();
      };
  
      fetchTableStats();
      
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});