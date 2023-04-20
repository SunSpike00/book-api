const production = {
    PORT: 3050,
    DB: {
        host:"localhost",
        user:'root',
        database:'booklist',
        password:'root',
        port:"3306",
        connectionLimit:20,
        connectTimeout: 5000,
    },

}
const development = {
    PORT: 4050,
    DB: {
        host:"localhost",
        user:'root',
        database:'booklist',
        password:'root',
        port:"3306",
        connectionLimit:20,
        connectTimeout: 5000,
    },
}

module.exports = {production, development}