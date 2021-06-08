const app = require('express').Router()
const { validationResult } = require('express-validator')
const validation = require('../validation/register.validation')
const userModel = require('../models/user.models')
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');


app.get('/register', (req, res) => {
    let oldInputs = req.flash('oldInputs')[0]
    if (oldInputs == undefined) {
        oldInputs = {name: '',email: '',password: '', PasswordConfirmation: ''}
    }
    res.render('register.ejs', { isLoggedIn: req.session.isLoggedIn, errors: req.flash('errors'), oldInputs})
    
})

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ahmedsamir18824@gmail.com',
        pass: 'A987654321s',
    },
});

app.post('/handleRegister', validation, (req, res) => {
    const errors = validationResult(req)

    const { name, email, password } = req.body
    if (errors.isEmpty()) {
        bcrypt.hash(password, 7, async function (err, hash) {

            var token = jwt.sign({email}, 'SK');

            let options = {
                from: '"Node.js Team" <ahmedsamir18824@gmail.com>',
                to: email,
                subject: "Hello ✔", // Subject line
                html: `
                <div style="background-color:#bbf;color:red;padding:140px">
                <h1><a href="http://localhost:3000/check/${token}">click to confirmation</a></h1>
                </div>
                `,
              }
            let info = await transporter.sendMail(options, (err) => {
                if(err){
                    // req.flash('verification', false)

                    console.log('error');
                }else{
                    // req.flash('verification', true)
                }
            });

            await userModel.insertMany({ name, email, password: hash })
            res.redirect('/login')

        });
    } else {
        req.flash('errors', errors.array())
        req.flash('oldInputs', req.body)
        res.redirect('/register')

    }
})

app.get('/check/:token', async (req, res) => {
    let token = req.params.token
    jwt.verify(token, 'SK', async function(err, decoded) {
       await userModel.findOneAndUpdate({email: decoded.email}, {confirmed: true})
      });
    res.redirect('/login')
})


module.exports = app