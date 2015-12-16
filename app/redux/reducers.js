import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import { CHANGE_FILES } from './actions';

function files(state = [], action) {
    switch (action.type) {
        case CHANGE_FILES:
        return action.files;
        default:
        return state;
    }
}
const reducers = combineReducers({
    router: routerStateReducer,
    files
});

export default reducers;
