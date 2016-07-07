let tagsRoute = new require('express').Router();
import { getTags, setTags } from '../utils/filesystem';
import bodyParser from 'body-parser';
import alphaSort from 'alpha-sort';
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
    setTags('.config/tags', tags.alphaSort(alphaSort.asc), true, (err, contents) => {
        res.sendStatus(200);
    });
});

export default tagsRoute;
