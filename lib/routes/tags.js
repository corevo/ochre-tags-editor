let tagsRoute = new require('express').Router();
import { getTags, setTags } from '../utils/filesystem';
import bodyParser from 'body-parser';
let tags = [];

getTags('.config/tags', true, (err, contents) => {
    if (contents instanceof Array) {
        tags = contents;
    }
});

tagsRoute.get('/', (req, res) => {
    res.json(tags);
});

tagsRoute.use(bodyParser.json());

tagsRoute.post('/', (req, res) => {
    tags = req.body;
    setTags('.config/tags', tags, true, (err, contents) => {
        res.sendStatus(200);
    });
});

export default tagsRoute;
