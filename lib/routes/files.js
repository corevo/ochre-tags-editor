let filesRouter = new require('express').Router();
import statPath from '../utils/filesystem';

filesRouter.get('/:path', (req, res) => {
    statPath(req.params.path, (err, files) => {
        if (err) {
            res.status(404);
        } else {
            res.json(files);
        }
    });
});

export default filesRouter;
