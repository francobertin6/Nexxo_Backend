const sql = require("mysql2");
const sequelize = require("sequelize");
const Sequelize = new sequelize('mysql://root:@localhost:3306/data_base');
const Profile = require('express').Router();
const express = require('express');


Profile.use(express.json());

/* /SELECT_PROFILE: devuelve toda la data de un perfil*/
Profile.get('/selectProfile/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('SELECT * FROM profile WHERE User_Id = '+ id,
    {type: Sequelize.QueryTypes.SELECT})
    
    res.status(200).send(datos);
})


/* /CREATEPROFILE: CREA UN PERFIL VACIO, SOLO ES PARA LINKEAR UN PERFIL A UN USUARIO MEDIANTE SU FOREIGN KEY (User_Id) */

async function create_a_profile(id){
    let datos = await Sequelize.query('INSERT INTO profile (User_Id) VALUES (?)',
    {replacements:[id]})
    .then(function(res){
        console.log(res)
    })
    return datos
}

Profile.post('/createProfile',async(req,res) => {
    await create_a_profile(req.body.User_Id);
    res.status(200).send("el perfil fue creado");
})

/* /CREATE_ALL_JSON: crea un JSON vacio en todos las columnas que necesiten un json en un perfil*/

Profile.put('/createAll_Json', async(req,res) => {

    let datos = await Sequelize.query('UPDATE profile SET Habilities_json = JSON_OBJECT(), Education_json = JSON_OBJECT(), Description = JSON_OBJECT() WHERE User_Id = ?',
    {replacements:[req.body.User_Id]})
    .then(function(res){
        console.log(res)
    })
    console.log(datos)

    res.status(200).send('json vacio creado en USUARIO ' + req.body.User_Id)
})

/* /CREATE_NEW: se crea una forma de fusionar json ( uno viejo con otro nuevo y viceversa )*/ 

Profile.put('/create_New/:json', async(req,res) => {

    let json = req.params.json;

    console.log(JSON.stringify(req.body))

    let datos = await Sequelize.query('UPDATE profile SET '+ json +'= JSON_MERGE(? , ?) WHERE User_Id = ?',
    {replacements:[JSON.stringify(req.body.jsonDoc1), JSON.stringify(req.body.jsonDoc2), req.body.User_Id]})
    .then(function(res){
        console.log(res)
    })
    console.log(datos)

    res.status(200).send("contenido actualizado");
})

/* /UPDATE_JSON/:JSON: llamada donde se actualizara el contenido de un json en especifico, FUNCIONA
    req.body.modifyKEY =  LA KEY DEL PARAMETRO A ACTUALIZAR
    req.body.modifyVALUE =  EL VALUE DEL PARAMETRO A ACTUALIZAR
*/

Profile.put('/update_Json/:json', async(req,res) => {
    let json = req.params.json;

    let datos = await Sequelize.query('UPDATE profile SET '+ json +'= JSON_REPLACE(?,?,?) WHERE User_Id = ?',
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.modifyKEY, req.body.modifyVALUE, req.body.User_Id ]})

    console.log(datos);

    res.status(200).send("contenido actualizado");
})

/* /DELETE_JSON/:JSON : llamado donde se borrara un parametro o un elemento de un objeto, etc, FUNCIONA*/

Profile.put('/delete_Json/:json', async(req,res) => {
    let json = req.params.json;

    let datos = await Sequelize.query('UPDATE profile SET '+ json + '= JSON_REMOVE(?,?) WHERE User_Id = ?',
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.removeJSON, req.body.User_Id ]})

    console.log(datos, req.body.User_Id);

    res.status(200).send("contenido borrado")
})

/* /DESCRIPTION_PROFILE: descripcion de 255 caracteres en el perfil*/

Profile.put('/description_Profile/:id', async(req,res) => {

    let id = req.params.id;
    let description = req.body.description;

    let datos = await Sequelize.query('UPDATE profile SET Description = ? WHERE User_Id = ?',
    {replacements:[description, id]})

    console.log(description);

    res.status(200).send("descripcion incluida")
})

/* /JSON_EXTRACT/:ID : extrae la informacion de un json, IMPORTANTE EL AS results, cuando pido data*/

Profile.get('/extractJSON/:id', async(req,res) => {

    let id = req.params.id;

    let datos = await Sequelize.query('SELECT JSON_EXTRACT(?, ?) AS results FROM profile WHERE User_id = '+ id,
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.extractINFO]})

    console.log(datos);

    res.status(200).send(datos[0][0].results)
})


/* /JSON_INSERT/:PARAMS/:ID : inserta un parametro y su valor, solo cosas chicas no objetos  */ 

Profile.put('/insertJSON/:params/:id', async(req,res) => {

    let id = req.params.id;
    let params = req.params.params;

    let datos = await Sequelize.query('UPDATE profile SET '+ params +' = JSON_INSERT(?, ?, ?) WHERE User_id = ' + id,
    {replacements:[JSON.stringify(req.body.jsonDoc), req.body.typeJSON, req.body.valueJSON ]})

    console.log(datos);

    res.status(200).send("contenido actualizado");

})


/* /PROFILE_PICTURE: subir imagen de perfil al perfil, INVESTIGAR COMO HACERLO*/




module.exports = Profile;