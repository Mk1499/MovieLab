const {Pool,Client} = require('pg'); 

const client = new Client({
    user:process.env.PGUSER,
    host:process.env.PGHOST,
    database:process.env.PGDATABASE,
    password:process.env.PGPASSWORD,
    port:process.env.PGPORT,
    ssl:true
})
 client.connect()
// const res =  client.query('SELECT NOW()')
//  client.end()
module.exports = client; 