const express = require('express');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars')
const router = require('./router/router')

const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs"
})

dotenv.config();
let port = process.env.PORT;

const app = express();

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
app.use(express.urlencoded({extended: true}))

app.use(express.json())
app.use(router)


app.listen(port, ()=>{
    console.log(port);
})