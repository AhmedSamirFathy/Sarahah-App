const app = require('express').Router()
const messageModel = require('../models/message.models')
const userModel = require('../models/user.models')


let userID 
app.get('/user/:id', async (req, res) => {
    userID = req.params.id
    let user = await userModel.findOne({_id: userID})
    res.render('user.ejs', {name:user.name, isLoggedIn: req.session.isLoggedIn})
})

app.post('/handleUser', async (req, res) => {
    const {message} = req.body
    await messageModel.insertMany({message, userID})
    // console.log(req.body);
    res.redirect('/user/' + userID)
})


module.exports = app