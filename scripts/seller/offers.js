const sql = require("mysql2");
const sequelize = require("sequelize");
const Sequelize = new sequelize('mysql://root:@localhost:3306/data_base');
const Offers = require('express').Router();
const express = require('express');

Offers.use(express.json());

/**/

Offers.post('/new_Offers/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('INSERT INTO offers (Seller_user_id) VALUES (?)',
    {replacements:[id]})

    console.log(datos);

    res.status(200).send('creado offers/orders para vendedor: Seller_user_Id '+ id);

})

/* /CREATE offers_JSON: crea un json en offers_json*/

Offers.put('/create_json/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE offers SET offers_json = JSON_OBJECT() WHERE Seller_user_id = ?',
    {replacements:[id]})

    console.log(datos)

    res.status(200).send('creado json en offers_json de seller_user_id: '+ id);
})

/* /CREATE_NEW: fusiona nuevo contenido con otro viejo mediante un MERGE*/

Offers.put('/create_new/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE offers SET offers_json = JSON_MERGE(?, ?) WHERE Seller_user_id = ?',
    {replacements:[JSON.stringify(req.body.jsondoc1), JSON.stringify(req.body.jsondoc2), id]})

    console.log(datos)

    res.status(200).send("contenido actualizado");
})

/* /UPDATE_JSON: donde se actualizara el contenido de offers_json*/

Offers.put('/update_json/:id', async(req,res) => {
    
    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE offers SET offers_json = JSON_REPLACE(?, ?, ?) WHERE Seller_user_id = ?',
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.modifyKEY, req.body.modifyVALUE, id]})

    console.log(datos);

    res.status(200).send("contenido actualizado")
})

/* /DELETE_JSON/:JSON : llamado donde se borrara un parametro o un elemento de un objeto, etc, ESTE FUNCIONA DE VERDAD */

Offers.put('/delete_json/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE offers SET offers_json = JSON_REMOVE(?,?) WHERE Seller_user_id = ?',
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.deleteJSON, id]})

    console.log(datos);

    res.status(200).send("contenido borrado");
})

/* /SELECT_PROFILE/:ID : selecciona LA OFERTA de un usuario en especifico */ 

Offers.get('/selectOffers_user/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('SELECT * FROM offers WHERE Seller_user_id = '+ id,
    {type: Sequelize.QueryTypes.SELECT})

    res.status(200).send(datos[0]);
})

/* /JSON_INSERT/:ID : inserta un parametro y su valor, solo cosas chicas no objetos  */ 

Offers.put('/insertJSON/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE offers SET offers_json = JSON_INSERT(?, ?, ?) WHERE Seller_user_id = ' + id,
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.typeJSON, req.body.valueJSON ]})

    console.log(datos);

    res.status(200).send("contenido actualizado");

})

module.exports = Offers;