import * as mysql from 'mysql2/promise'
// create the connection

let _connection: mysql.Connection

export const endConnection = () => {
  if (_connection) _connection.end()
}

export const getConnection = async () => {
  if (!_connection) {
    _connection = await mysql.createConnection({
      database: process.env.MYSQL_DB,
      host: process.env.MYSQL_HOST,
      namedPlaceholders: true,
      password: process.env.MYSQL_PASS,
      port: +process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
    })
  }
  return _connection
}