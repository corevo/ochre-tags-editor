let filesRouter = new require('express').Router();
import statPath from '../utils/filesystem';

filesRouter.get('/*', (req, res) => {
    statPath(req.url, (err, files) => {
        if (err) {
            res.status(404);
        } else {
            res.json(files);
        }
    });
});

export default filesRouter;
