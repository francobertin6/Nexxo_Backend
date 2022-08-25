const sql = require("mysql2");
const sequelize = require("sequelize");
const Sequelize = new sequelize('mysql://root:@localhost:3306/data_base');
const History_json = require('express').Router();
const express = require('express');

History_json.use(express.json());

/* /CREATE_HISTORY_SEARCH: crea un historial para un nuevo usuario*/

History_json.post('/new_History_json/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('INSERT INTO history_search (User_id) VALUES (?)',
    {replacements:[id]})

    console.log(datos);

    res.status(200).send('creado historial de busqueda para usuario: User_Id '+ id);
})

/* /CREATE HISTORY_JSON: crea un json en history_json*/

History_json.put('/create_json/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE history_search SET Search_history = JSON_OBJECT() WHERE User_id = ?',
    {replacements:[id]})

    console.log(datos)

    res.status(200).send('creado json en search_history de user_id: '+ id);
})

/* /CREATE_NEW: fusiona nuevo contenido con otro viejo mediante un MERGE*/

History_json.put('/create_new/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE history_search SET Search_history = JSON_MERGE(?, ?) WHERE User_id = ?',
    {replacements:[JSON.stringify(req.body.jsondoc1), JSON.stringify(req.body.jsondoc2), id]})

    console.log(datos)

    res.status(200).send("contenido actualizado");
})

/* /UPDATE_JSON: donde se actualizara el contenido de search_history*/

History_json.put('/update_json/:id', async(req,res) => {
    
    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE history_search SET Search_history = JSON_REPLACE(?, ?, ?) WHERE User_id = ?',
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.modifyKEY, req.body.modifyVALUE, id]})

    console.log(datos);

    res.status(200).send("contenido actualizado")
})

/* /DELETE_JSON/:JSON : llamado donde se borrara un parametro o un elemento de un objeto, etc, ESTE FUNCIONA DE VERDAD */

History_json.put('/delete_json/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE history_search SET Search_history = JSON_REMOVE(?,?) WHERE User_id = ?',
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.deleteJSON, id]})

    console.log(datos);

    res.status(200).send("contenido borrado");
})

/* /SELECT_PROFILE/:ID : selecciona el historial de un usuario en especifico */ 

History_json.get('/selectHistory_search/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('SELECT * FROM history_search WHERE User_id = '+ id,
    {type: Sequelize.QueryTypes.SELECT})

    res.status(200).send(datos[0].Search_history);
})

/* /JSON_EXTRACT/:ID : extrae la informacion de un json, IMPORTANTE EL AS results, cuando pido data*/

History_json.get('/extractJSON/:id', async(req,res) => {
    
    let id = req.params.id;

    let datos = await Sequelize.query('SELECT JSON_EXTRACT(?, ?) AS results FROM history_search WHERE User_id = '+ id,
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.extractINFO]})

    console.log(datos);

    res.status(200).send(datos[0][0].results)
})

/* /JSON_INSERT/:ID : inserta un parametro y su valor, solo cosas chicas no objetos  */ 

History_json.put('/insertJSON/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('UPDATE history_search SET Search_history = JSON_INSERT(?, ?, ?) WHERE User_id = ' + id,
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.typeJSON, req.body.valueJSON ]})

    console.log(datos);

    res.status(200).send("contenido actualizado");

})

module.exports = History_json;