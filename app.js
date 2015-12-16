import express from 'express';
import files from './lib/routes/files';

let port = process.env.TAGS_PORT || 8080;
let app = express();

app.use('/api', files);

app.use('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server.
let server = app.listen(port, () => {
    let { address } = server.address();
    console.log(`Server listening at http:\/\/${address}:${port}`);
});
