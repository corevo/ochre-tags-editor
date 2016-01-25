let tagsRoute = new require('express').Router();
import { getTags, setTags } from '../utils/filesystem';
import bodyParser from 'body-parser';
let tags = [];

getTags('.config/tags', true, (err, contents) => {
    tags = contents;
});

tagsRoute.get('/', (req, res) => {
    res.json(tags);
});

filesRouter.use(bodyParser.json());

tagsRoute.post('/', (req, res) => {
    tags = req.body;
    setTags('.config/tags', true, (err, contents) => {
        tags = contents;
    });
});

export default tagsRoute;
