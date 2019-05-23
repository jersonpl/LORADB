var mysql = require('mysql');

module.exports = () => {
    return mysql.createConnection({
        host: 'diseno.cxmeswdphwpd.us-east-1.rds.amazonaws.com',
        user: 'dherreraj',
        password: '9805jama',
        database: 'diseno'
    });
}
