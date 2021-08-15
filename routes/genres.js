const express = require("express");
const Joi = require("joi");
const router = express.Router();

const genres = [
    {id: 1, name: "genre1"},
    {id: 2, name: "genre2"},
    {id: 3, name: "genre3"},
]

router.get("/", (req, res) => {
    res.send(genres);
});

router.get("/:id", (req, res) => {
    const genre = genres.find(genre => genre.id === parseInt(req.params.id));
    if (!genre) return res.status(404).send("Genre with given id is not found.");

    res.send(genre);
});

router.post("/", (req, res) => {
    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        name: req.body.name,
    }
    genres.push(genre);

    res.send(genre);
});

router.put("/:id", (req, res) => {
    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = genres.find(genre => genre.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("Genre with given id is not found.");

    genre.name = req.body.name;

    res.send(genre);
});

router.delete("/:id", (req, res) => {
   const genre = genres.find(genre => genre.id === parseInt(req.params.id));
   if(!genre) return res.status(404).send("Genre with given id is not found.");

   const index = genres.indexOf(genre);
   genres.splice(index, 1);

   res.send(genre);
});

const validateGenre = genre => {
    const genreSchema = Joi.object({
        name: Joi.string().min(3).max(255).required().label("Name"),
    })
    return genreSchema.validate(genre);
};

module.exports = router;