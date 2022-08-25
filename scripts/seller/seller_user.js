const sql = require("mysql2");
const sequelize = require("sequelize");
const Sequelize = new sequelize('mysql://root:@localhost:3306/data_base');
const Seller = require('express').Router();
const express = require('express');

Seller.use(express.json());

/* CREA LA CONEXION ENTRE UN USUARIO Y SU DESEO DE CONVERTIRSE EN VENDEDOR */ 
Seller.post('/seller_user', async(req,res) => {

    let datos = await Sequelize.query('INSERT INTO seller_user (User_id) VALUES (?)',
    {replacements:[req.query.id]});

    console.log(datos);

    res.status(200).send("seller user creado para usuario id "+ req.query.id);
})

Seller.get('/select_seller/:id', async(req,res) => {

    let Id = req.params.id;

    let datos = await Sequelize.query('SELECT * FROM seller_user WHERE id = ' + Id,
    {type: Sequelize.QueryTypes.SELECT})

    console.log(datos);

    res.status(200).send(datos);

    res.status(404).send("este usuario "+ Id +" no es vendedor")

})




module.exports = Seller;