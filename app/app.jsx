import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link } from 'react-router';
import { reduxReactRouter, ReduxRouter, pushState } from 'redux-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { createStore, compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { createHistory } from 'history';
import searchApp from './redux/reducers';
import { changeFiles } from './redux/actions';
import request from 'superagent';
import Explorer from './views/explorer';

let store = compose(
    reduxReactRouter({ createHistory })
)(createStore)(searchApp);
const dispatch = store.dispatch;

class App extends React.Component {
    static propTypes = {
        children: React.PropTypes.node
    }
    constructor(props) {
        super(props);
    }
    render () {
        return (
            <div>
                <h1>FS</h1>
                {React.cloneElement(this.props.children, {
                    setFiles: function(files) {
                        dispatch(changeFiles(files));
                    },
                    files: this.props.files
                })}
            </div>
        );
    }
}

let Appx = connect(
    // Use a selector to subscribe to state
    state => ({
        q: state.router.location.query.q,
        files: state.files
    }),
    // Use an action creator for navigation
    { pushState }
)(App);

let routes = (
    <Route path="/" component={Appx}>
        <IndexRoute component={Explorer} />
        <Route path="/*" component={Explorer} />
    </Route>
);

class Root extends React.Component {
    render() {
        return (
            <div>
                <Provider store={store}>
                    <ReduxRouter>
                        {routes}
                    </ReduxRouter>
                </Provider>
            </div>
        );
    }
}

ReactDOM.render(<Root />, document.getElementById('app'));
