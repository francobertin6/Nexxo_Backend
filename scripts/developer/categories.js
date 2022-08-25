const Categories = require('express').Router();
const express = require('express');
const fs = require("fs");

Categories.use(express.json());

const json_categories = fs.readFileSync('public/categoria_json/Categories.json');
const categories = JSON.parse(json_categories);


Categories.get("/get_categories", async(req, res) => {

    res.status(200).send(categories);

})


module.exports = Categories;