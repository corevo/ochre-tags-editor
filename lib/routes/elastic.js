let elasticRouter = new require('express').Router();
import elastic from 'elasticsearch';

let client = new elastic.Client({
    host: process.env.ELASTIC_SERVER || "localhost:9200"
});

elasticRouter.get('/count', (req, res) => {
    client.count({
        index: "files"
    }, (err, response) => {
        if (!err)
            res.json({ count: response.count });
        else
            res.sendStatus(503);
    });
});

module.exports = elasticRouter;
