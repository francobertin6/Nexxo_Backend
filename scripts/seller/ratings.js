const sql = require("mysql2");
const sequelize = require("sequelize");
const Sequelize = new sequelize('mysql://root:@localhost:3306/data_base');
const Rating = require('express').Router();
const express = require('express');

Rating.use(express.json());

/**/

Rating.post('/new_Rating/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('INSERT INTO user_rating (Seller_user_id) VALUES (?)',
    {replacements:[id]})

    console.log(datos);

    res.status(200).send('creado rating para vendedor: Seller_user_Id '+ id);

})

/* /CREATE RATING_JSON: crea un json en seller_rating*/

Rating.put('/create_json/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE user_rating SET seller_rating = JSON_OBJECT() WHERE Seller_user_id = ?',
    {replacements:[id]})

    console.log(datos)

    res.status(200).send('creado json en seller_rating de seller_user_id: '+ id);
})

/* /CREATE_NEW: fusiona nuevo contenido con otro viejo mediante un MERGE*/

Rating.put('/create_new/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE user_rating SET seller_rating = JSON_MERGE(?, ?) WHERE Seller_user_id = ?',
    {replacements:[JSON.stringify(req.body.jsondoc1), JSON.stringify(req.body.jsondoc2), id]})

    console.log(datos)

    res.status(200).send("contenido actualizado");
})

/* /UPDATE_JSON: donde se actualizara el contenido de seller_rating*/

Rating.put('/update_json/:id', async(req,res) => {
    
    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE user_rating SET seller_rating = JSON_REPLACE(?, ?, ?) WHERE Seller_user_id = ?',
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.modifyKEY, req.body.modifyVALUE, id]})

    console.log(datos);

    res.status(200).send("contenido actualizado")
})

/* /DELETE_JSON/:JSON : llamado donde se borrara un parametro o un elemento de un objeto, etc, ESTE FUNCIONA DE VERDAD */

Rating.put('/delete_json/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE user_rating SET seller_rating = JSON_REMOVE(?,?) WHERE Seller_user_id = ?',
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.deleteJSON, id]})

    console.log(datos);

    res.status(200).send("contenido borrado");
})

/* /SELECT_PROFILE/:ID : selecciona el historial de un usuario en especifico */ 

Rating.get('/selectRatings_user/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('SELECT * FROM user_rating WHERE Seller_user_id = '+ id,
    {type: Sequelize.QueryTypes.SELECT})

    res.status(200).send(datos[0].seller_rating);
})

/* /JSON_EXTRACT/:ID : extrae la informacion de un json, IMPORTANTE EL AS results, cuando pido data*/

Rating.get('/extractJSON/:id', async(req,res) => {
    
    let id = req.params.id;

    let datos = await Sequelize.query('SELECT JSON_EXTRACT(?, ?) AS results FROM user_rating WHERE Seller_user_id = '+ id,
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.extractINFO]})

    console.log(datos);

    res.status(200).send(datos[0][0].results)
})

/* /JSON_INSERT/:ID : inserta un parametro y su valor, solo cosas chicas no objetos  */ 

Rating.put('/insertJSON/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE user_rating SET seller_rating = JSON_INSERT(?, ?, ?) WHERE Seller_user_id = ' + id,
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.typeJSON, req.body.valueJSON ]})

    console.log(datos);

    res.status(200).send("contenido actualizado");

})


module.exports = Rating;