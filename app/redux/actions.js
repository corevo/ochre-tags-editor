/*
 * action types
 */

export const CHANGE_FILES = 'CHANGE_FILES';

/*
 * action creators
 */

export function changeFiles(files) {
    return { type: CHANGE_FILES, files };
}
