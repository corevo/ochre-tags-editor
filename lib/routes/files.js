let filesRouter = new require('express').Router();
import bodyParser from 'body-parser';
import { statPath, setTags } from '../utils/filesystem';

filesRouter.get('/*', (req, res) => {
    statPath(decodeURI(req.url), (err, result) => {
        if (err) {
            res.sendStatus(404);
        } else {
            res.json(result);
        }
    });
});

filesRouter.use(bodyParser.json());

filesRouter.post('/*', (req, res) => {
    let stats = {
        tags: req.body.tags,
        author: req.body.author,
        unit: req.body.unit
    };
    if (req.body.date) {
        stats.date = req.body.date;
    }
    setTags(decodeURI(req.url), stats, (err) => {});
    res.sendStatus(200);
});

export default filesRouter;
