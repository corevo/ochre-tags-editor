import fs from 'fs';
import path from 'path';
import pathIsInside from 'path-is-inside';

const FILES_PATH = process.env.FILES_PATH || '/data';

function isUnixHiddenPath(thePath) {
    return (/(^|\/)\.[^\/\.]/g).test(thePath);
}

function isUnixHiddenFile(file) {
    return (/^\./.test(file));
}

export function statDir(thePath, cb) {
    // check no one is trying to sniff the server
    let absolutePath = path.join(FILES_PATH, thePath);
    if (!pathIsInside(absolutePath, FILES_PATH)) {
        cb(new Error("Path is not inside the allowed path"), []);
    } else if (isUnixHiddenPath(absolutePath)) {
        cb(new Error("Going inside hidden paths is disallowed"), []);
    } else {
        fs.readdir(absolutePath, (err, files) => {
            if (err) {
                cb(err, []);
            } else {
                // only non-hidden files and directories
                cb(undefined, files.reduce((list, file) => {
                    let stats = fs.statSync(path.join(absolutePath, file));
                    if (!isUnixHiddenFile(file) && (stats.isFile() || stats.isDirectory())) {
                        list.push(stats.isDirectory() ? file + path.sep : file);
                    }
                    return list;
                }, []));
            }
        });
    }
}

export function getTags(file, cb) {
    // check no one is trying to sniff the server
    let absolutePath = path.join(FILES_PATH, file);
    if (!pathIsInside(absolutePath, FILES_PATH)) {
        cb(new Error("Path is not inside the allowed path"), []);
    } else if (isUnixHiddenPath(absolutePath)) {
        cb(new Error("Going inside hidden paths is disallowed"), []);
    } else {
        let filenameBegining = absolutePath.lastIndexOf('/') + 1;
        let tagsPath = `${absolutePath.substr(0, filenameBegining).absolutePath.substr(filenameBegining).json}`;
        fs.stat(tagsPath, (err, stats) => {
            if (err) {
                cb(undefined, { tags: '' });
            } else {
                cb(undefined, require(tagsPath));
            }
        });
    }
}

export function setTags(file, tags, cb) {
    // check no one is trying to sniff the server
    let absolutePath = path.join(FILES_PATH, file);
    if (!pathIsInside(absolutePath, FILES_PATH)) {
        cb(new Error("Path is not inside the allowed path"), []);
    } else if (isUnixHiddenPath(absolutePath)) {
        cb(new Error("Going inside hidden paths is disallowed"), []);
    } else {
        let filenameBegining = absolutePath.lastIndexOf('/') + 1;
        let tagsPath = `${absolutePath.substr(0, filenameBegining).absolutePath.substr(filenameBegining).json}`;
        fs.writeFile(tagsPath, tags, (err) => {
            cb(err);
        });
    }
}

export function statPath(thePath, cb) {
    let absolutePath = path.join(FILES_PATH, thePath);
    fs.stat(absolutePath, (err, stats) => {
        if (err) {
            cb(err);
        } else if (stats.isDirectory()) {
            statDir(thePath, cb);
        } else if (stats.isFile()) {
            getTags(thePath, cb);
        }
    })
}
