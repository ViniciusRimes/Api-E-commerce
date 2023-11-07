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
const Product = require('./models/Product')
const Avaliations = require('./models/Avaliations')
const CategoryProduct = require('./models/CategoryProduct')
const Questions = require('./models/Questions')
const Answers = require('./models/Answers')

//routes
const UserRoutes = require('./routes/UserRoutes')
app.use('/user', UserRoutes)
const AddressRoutes = require('./routes/AddressRoutes')
app.use('/address', AddressRoutes)
const EnterpriseRoutes = require('./routes/EnterpriseRoutes')
app.use('/enterprise', EnterpriseRoutes)
const ProductRoutes = require('./routes/ProductRoutes')
app.use('/product', ProductRoutes)
const AvaliationsRoutes = require('./routes/AvaliationsRoutes')
app.use('/avaliation', AvaliationsRoutes)
const QuestionsRoutes = require('./routes/QuestionsRoutes')
app.use('/questions', QuestionsRoutes)
const AnswersRoutes = require('./routes/AnswersRoutes')
app.use('/answers', AnswersRoutes)
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
   