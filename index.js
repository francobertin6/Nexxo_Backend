const express = require('express');
const server = express();
const cors = require('cors');
const path = require("path");


server.listen(3500, ()=>{
    console.log("se a iniciado el servidor");
});

server.use(express.json());
server.use(express.urlencoded({extended : true}))

// importacion user
const user = require("./scripts/user/usuario");
const profile = require("./scripts/user/perfil");
const history_json = require("./scripts/user/historial_busqueda");
const favorites = require("./scripts/user/favorites");

//importacion seller_user
const seller = require("./scripts/seller/seller_user");
const rating = require("./scripts/seller/ratings");
const dashboard = require("./scripts/seller/dashboard");
const offers = require("./scripts/seller/offers");


// endpoint user
server.use(cors());
server.use('/user', user);
server.use('/profile', profile);
server.use('/history_json', history_json);
server.use('/favorites', favorites);

// endpoint seller_user
server.use('/seller', seller);
server.use('/rating', rating);
server.use('/dashboard', dashboard);
server.use('/offers', offers);


