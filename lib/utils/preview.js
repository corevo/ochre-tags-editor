import fs from 'fs';
import path from 'path';
import pathIsInside from 'path-is-inside';

const FILES_PATH = process.env.FILES_PATH || '/data';
const PREVIEW_PATH = process.env.PREVIEW_PATH || '/data/.previews';

export default function fileOrPreview(file, cb) {
    let previewFile = path.join(PREVIEW_PATH, file.substr(0, file.lastIndexOf('.') + 1) + "pdf");
    fs.access(previewFile, fs.R_OK, (err) => {
        cb(err ? path.join(FILES_PATH, file) : previewFile);
    });
}
