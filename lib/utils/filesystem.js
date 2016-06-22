import fs from 'fs';
import path from 'path';
import pathIsInside from 'path-is-inside';

const FILES_PATH = process.env.FILES_PATH || '/data';
const METADATA_PATH = process.env.METADATA_PATH || '/data/.metadata';

function isUnixHiddenPath(thePath) {
    return (/(^|\/)\.[^\/\.]/g).test(thePath);
}

function isUnixHiddenFile(file) {
    return (/^\./.test(file));
}

export function canAccess(absolutePath) {
    if (!pathIsInside(absolutePath, FILES_PATH)) {
        return (new Error("Path is not inside the allowed path"), []);
    } else if (isUnixHiddenPath(absolutePath)) {
        return (new Error("Going inside hidden paths is disallowed"), []);
    } else {
        return true;
    }
}

export function statDir(thePath, cb) {
    // check no one is trying to sniff the server
    let absolutePath = path.join(FILES_PATH, thePath);
    let access = canAccess(absolutePath);
    if (!access) {
        cb(access);
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

export function getTags(file, overrideHidden, cb) {
    if (typeof overrideHidden === "function") {
        cb = overrideHidden;
        overrideHidden = false;
    }
    // check no one is trying to sniff the server
    let absolutePath = path.join(FILES_PATH, file);
    let access = canAccess(absolutePath);
    if (!access) {
        cb(access);
    } else {
        const fileHash = md5(fs.readFileSync(file));
        let filenameBegining = absolutePath.lastIndexOf(path.sep) + 1;
        let tagsPath = path.join(METADATA_PATH, `.${fileHash}.json`);
        fs.stat(tagsPath, (err, stats) => {
            if (err) {
                cb(undefined, { tags: [] });
            } else {
                cb(undefined, require(tagsPath));
            }
        });
    }
}

export function setTags(file, tags, overrideHidden, cb) {
    if (typeof overrideHidden === "function") {
        cb = overrideHidden;
        overrideHidden = false;
    }
    // check no one is trying to sniff the server
    let absolutePath = path.join(FILES_PATH, file);
    let access = canAccess(absolutePath);
    if (!access) {
        cb(access);
    } else {
        const fileHash = md5(fs.readFileSync(file));
        let filenameBegining = absolutePath.lastIndexOf(path.sep) + 1;
        let tagsPath = path.join(METADATA_PATH, `.${fileHash}.json`);
        fs.writeFile(tagsPath, JSON.stringify(tags), (err) => {
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
