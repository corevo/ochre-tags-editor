import express from 'express';
import path from 'path';
import files from './lib/routes/files';
import tags from './lib/routes/tags';

let port = process.env.TAGS_PORT || 8080;
let app = express();

const STATIC_DIR = path.join(__dirname, 'public/assets');
app.use('/assets', express.static(STATIC_DIR));

app.use('/api/files', files);
app.use('/api/tags', tags);

app.use('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server.
let server = app.listen(port, () => {
    let { address } = server.address();
    console.log(`Server listening at http:\/\/${address}:${port}`);
});
