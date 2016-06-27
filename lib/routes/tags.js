let tagsRoute = new require('express').Router();
import fs from 'fs';
import { getTags, setTags } from '../utils/filesystem';
import bodyParser from 'body-parser';
let tags = JSON.parse(fs.readFileSync('.config/tags'));

tagsRoute.get('/', (req, res) => {
    res.json(tags);
});

tagsRoute.use(bodyParser.json());

tagsRoute.post('/', (req, res) => {
    tags = req.body;
    fs.writeFile('.config/tags', JSON.stringify(tags), (err) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

export default tagsRoute;
