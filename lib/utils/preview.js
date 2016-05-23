import fs from 'fs';
import path from 'path';
import pathIsInside from 'path-is-inside';

const FILES_PATH = process.env.FILES_PATH || '/data';
const PREVIEW_PATH = process.env.PREVIEW_PATH || '/data/.previews';

export default function fileOrPreview(file, cb) {
    fs.access(path.join(PREVIEW_PATH, file), fs.R_OK, (err) => {
        cb(path.join(err ? FILES_PATH : PREVIEW_PATH, file));
    });
}
