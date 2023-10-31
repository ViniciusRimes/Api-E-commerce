const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

//tratamento de erros
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    console.log('Exit')
    process.exit(1);
});
//cors
app.use(cors({
    origin: 'http://localhost/3000',
    methods: 'GET, HEAD, PUT, POST, DELETE, PATCH',
    credentials: true
}))
//json
app.use(express.json())
//models
const User = require('./models/User')
const Address = require('./models/Address')
const AddressUser = require('./models/AddressUser')
const Enterprise = require('./models/Enterprise')

//routes
const UserRoutes = require('./routes/UserRoutes')
app.use('/user', UserRoutes)
//connection
const conn = require('./db/conn')
conn
.sync()
//.sync({force: true})
//.sync({alter: true})
.then(()=>{
    app.listen(5000)
    console.log('Conectado')
}).catch((error)=>{
    console.log(error)
})
   