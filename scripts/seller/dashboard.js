const sql = require("mysql2");
const sequelize = require("sequelize");
const Sequelize = new sequelize('mysql://root:@localhost:3306/data_base');
const Dashboard = require('express').Router();
const express = require('express');

Dashboard.use(express.json());

/**/

Dashboard.post('/new_Dashboard/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('INSERT INTO dashboard (Seller_user_id) VALUES (?)',
    {replacements:[id]})

    console.log(datos);

    res.status(200).send('creado dashboard para vendedor: Seller_user_Id '+ id);

})

/* /CHANGE_VALUES = este call es universal para dashboard, value es la tabla a modificar y el int es el numero que le corresponde*/

Dashboard.put('/change_values/:id', async(req,res) => {

    let id = req.params.id;
    
    let value = Object.keys(req.query)[0];
    let int = Object.values(req.query)[0];

    let datos = await Sequelize.query('UPDATE dashboard SET '+ value +' = '+ int +' WHERE Seller_user_id = ?',
    {replacements:[id]})

    console.log(datos);

    res.status(200).send(value +" se ha actualizado con el valor "+ int + " usuario id = "+ id);
})

module.exports = Dashboard;