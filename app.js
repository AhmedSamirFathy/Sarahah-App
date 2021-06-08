const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const mongoose = require('mongoose')
var session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session);
var flash = require('connect-flash');


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(express.json())

var store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/Sarahah-App',
    collection: 'mySessions'
  });

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store
  }))

mongoose.connect('mongodb://localhost:27017/Sarahah-App', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false  })

app.use(require('./routes/index.routes'))
app.use(require('./routes/register.routes'))
app.use(require('./routes/login.routes'))
app.use(require('./routes/messages.routes'))
app.use(require('./routes/user.routes'))

app.listen(port, () => console.log(`Server is running....`))