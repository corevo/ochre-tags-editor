let filesRouter = new require('express').Router();
import bodyParser from 'body-parser';
import { statPath, setTags } from '../utils/filesystem';

filesRouter.get('/*', (req, res) => {
    statPath(req.url, (err, result) => {
        if (err) {
            res.sendStatus(404);
        } else {
            res.json(result);
        }
    });
});

filesRouter.use(bodyParser.json());

filesRouter.post('/*', (req, res) => {
    setTags(req.url, req.body, (err) => {});
    res.sendStatus(200);
});

export default filesRouter;
