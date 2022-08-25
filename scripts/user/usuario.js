const sql = require("mysql2");
const sequelize = require("sequelize");
const Sequelize = new sequelize('mysql://root:@localhost:3306/data_base');
const user = require('express').Router();
const express = require('express');

user.use(express.json());

/* FUNCIONES QUE REGISTRAN UN USUARIO */
async function create_user(email, username, password){
    let datos = await Sequelize.query('INSERT INTO user (Email, UserName, Password) VALUES (?, ?, ?)',
    {replacements:[email, username, password]})
    .then(function(resultados){
        console.log(resultados)
    })
    return datos
}

user.post('/register', async (req,res) => {
    if(!req.body.Email || !req.body.UserName || !req.body.Password){
        res.status(400).send("te faltan parametros");
        console.log(req.body)
    }
    else{
        await create_user(req.body.Email, req.body.UserName, req.body.Password);
        res.status(200).send(req.body)
    }
})
/* FUNCIONES QUE REGISTRAN UN USUARIO, FUNCIONA PERO HAY QUE EXPLAYAR */

/* FUNCIONES QUE LOGUEAN UN USUARIO */

user.post('/login', async (req,res) => {

    let username = req.body.UserName;
    let password = req.body.Password;
    let email = req.body.Email;

    if(!req.body.Email && req.body.UserName && req.body.Password){

    let check_username = await Sequelize.query('SELECT * FROM user WHERE UserName = ?',
    {replacements:[username], type:Sequelize.QueryTypes.SELECT});

    console.log(check_username[0])

    let check_password = await Sequelize.query('SELECT * FROM user WHERE Password = ?',
    {replacements:[password], type:Sequelize.QueryTypes.SELECT});

    console.log(check_password[0])

    if(check_username[0] === undefined || check_password[0] === undefined){
        res.status(400).send("login no autorizado");
    }
    else if(check_password[0].IdUser !== check_username[0].IdUser){
        res.status(400).send("login no autorizado")
    }
    else{
        res.status(200).send(check_username[0]);
    }
    }

    if(!req.body.UserName && req.body.Email && req.body.Password){

    let check_email = await Sequelize.query('SELECT * FROM user WHERE Email = ?',
    {replacements:[email], type:Sequelize.QueryTypes.SELECT});

    console.log(check_email[0])

    let check_password = await Sequelize.query('SELECT * FROM user WHERE Password = ?',
    {replacements:[password], type:Sequelize.QueryTypes.SELECT});

    console.log(check_password[0])

    if(check_email[0] === undefined || check_password[0] === undefined){
        res.status(400).send("login no autorizado");
    }
    else if(check_password[0].IdUser !== check_email[0].IdUser){
        res.status(400).send("login no autorizado")
    }
    else{
        res.status(200).send(check_email[0]);
    }

    }

})

/* FUNCIONES QUE LOGUEAN UN USUARIO */

user.get('/Get_user/:password', async (req, res) => {

    let password = req.params.password;

    let check_password = await Sequelize.query('SELECT * FROM user WHERE Password = ?',
    {replacements:[password], type:Sequelize.QueryTypes.SELECT});

    res.status(200).send(check_password[0]);

})


module.exports = user;