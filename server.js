const express = require('express');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars')
const router = require('./router/router')
const fileUpload = require('express-fileupload');
const session=require('express-session')
const session_variables = require('./middleware/variables')

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs"
})

dotenv.config();
let port = process.env.PORT;

const app = express();
app.use(fileUpload());
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.static('uploads'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(session_variables)
app.use(router)


app.listen(port, ()=>{
    console.log(port);
})