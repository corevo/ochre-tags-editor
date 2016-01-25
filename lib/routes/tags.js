let tagsRoute = new require('express').Router();

tagsRoute.get('/', (req, res) => {
    res.json(['hello', 'world']);
});

export default tagsRoute;
