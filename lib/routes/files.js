import path from 'path';
let filesRouter = new require('express').Router();
import bodyParser from 'body-parser';
import { statPath, setTags, canAccess } from '../utils/filesystem';
import fileOrPreview from '../utils/preview';

const FILES_PATH = process.env.FILES_PATH || '/data';

filesRouter.get('/*', (req, res) => {
    let file = decodeURI(req.url);
    if (file.indexOf("?") >= 0) {
        file = file.substr(0, file.indexOf("?"));
    }
    let absolutePath = path.join(FILES_PATH, file);
    let access = canAccess(absolutePath);
    if (req.query["file"] !== undefined && access) {
        fileOrPreview(file, res.sendFile);
    } else if (!access) {
        res.sendStatus(403);
    } else {
        statPath(file, (err, result) => {
            if (err) {
                res.sendStatus(404);
            } else {
                res.json(result);
            }
        });
    }
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
