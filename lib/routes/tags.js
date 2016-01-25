let tagsRoute = new require('express').Router();
import { getTags, setTags } from '../utils/filesystem';
let tags = [];

getTags('.config/tags', true, (err, contents) => {
    tags = contents;
});

tagsRoute.get('/', (req, res) => {
    res.json(tags);
});

tagsRoute.post('/', (req, res) => {
});

export default tagsRoute;
