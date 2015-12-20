let filesRouter = new require('express').Router();
import { statPath, setTags } from '../utils/filesystem';

filesRouter.get('/*', (req, res) => {
    statPath(req.url, (err, result) => {
        if (err) {
            res.status(404);
        } else {
            res.json(result);
        }
    });
});

filesRouter.post('/*', (req, res) => {
    setTags(req.url, (err, result) => {
        if (err) {
            res.status(400);
        } else {
            res.status(200);
        }
    });
});

export default filesRouter;
