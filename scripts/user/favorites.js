const sql = require("mysql2");
const sequelize = require("sequelize");
const Sequelize = new sequelize('mysql://root:@localhost:3306/data_base');
const Favorites = require('express').Router();
const express = require('express');

Favorites.use(express.json());

/* /newFavorites: crea un favorites para un nuevo usuario*/

Favorites.post('/newFavorites/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('INSERT INTO favorites (User_id) VALUES (?)',
    {replacements:[id]})

    console.log(datos);

    res.status(200).send('creado historial de favorites para usuario: User_Id '+ id);
})

/* /CREATE FAVORITES: crea un json en favorites*/

Favorites.put('/create_json/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE favorites SET Favorites_json = JSON_OBJECT() WHERE User_id = ?',
    {replacements:[id]})

    console.log(datos)

    res.status(200).send('creado json en Favorites_json de user_id: '+ id);
})

/* /CREATE_NEW: fusiona nuevo contenido con otro viejo mediante un MERGE*/

Favorites.put('/create_new/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE favorites SET Favorites_json = JSON_MERGE_PRESERVE(?, ?) WHERE User_id = ?',
    {replacements:[JSON.stringify(req.body.jsondoc1), JSON.stringify(req.body.jsondoc2), id]})

    console.log(datos)

    res.status(200).send("contenido actualizado");
})

/* /UPDATE_JSON: donde se actualizara el contenido de Favorites_json*/

Favorites.put('/update_json/:id', async(req,res) => {
    
    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE favorites SET Favorites_json = JSON_REPLACE(?, ?, ?) WHERE User_id = ?',
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.modifyKEY, req.body.modifyVALUE, id]})

    console.log(datos);

    res.status(200).send("contenido actualizado")
})

/* /DELETE_JSON/:JSON : llamado donde se borrara un parametro o un elemento de un objeto, etc, ESTE FUNCIONA DE VERDAD */

Favorites.put('/delete_json/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE favorites SET Favorites_json = JSON_REMOVE(?,?) WHERE User_id = ?',
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.deleteJSON, id]})

    console.log(datos);

    res.status(200).send("contenido borrado");
})

/* /SELECT_PROFILE/:ID : selecciona los favoritos de un usuario en especifico */ 

Favorites.get('/selectFavorites/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('SELECT * FROM favorites WHERE User_id = '+ id,
    {type: Sequelize.QueryTypes.SELECT})

    res.status(200).send(datos)
})

/* /JSON_EXTRACT/:ID : extrae la informacion de un json, IMPORTANTE EL AS results, cuando pido data*/

Favorites.get('/extractJSON/:id', async(req,res) => {
    
    let id = req.params.id;

    let datos = await Sequelize.query('SELECT JSON_EXTRACT(?, ?) AS results FROM favorites WHERE User_id = '+ id,
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.extractINFO]})

    console.log(datos);

    res.status(200).send(datos)
})

/* /JSON_INSERT/:ID : inserta un parametro y su valor, solo cosas chicas no objetos  */ 

Favorites.put('/insertJSON/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE favorites SET Favorites_json = JSON_INSERT(?, ?, ?) WHERE User_id = ' + id,
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.typeJSON, req.body.valueJSON ]})

    console.log(datos);

    res.status(200).send("contenido actualizado");

})





module.exports = Favorites;