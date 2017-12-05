import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import createHistory from 'history/createBrowserHistory'
import {routerMiddleware, routerReducer} from 'react-router-redux'

const reducers = {};//TODO create reducers


const history = createHistory();
const router = routerMiddleware(history);

const loggerMiddleware = createLogger();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createStoreWithMiddleware = composeEnhancers(applyMiddleware(router, thunk, loggerMiddleware))(createStore);

const reducer = combineReducers({...reducers, router: routerReducer});

export function getHistory() {
    return history;
}

export default function (initialState) {
    return createStoreWithMiddleware(reducer, initialState);
};