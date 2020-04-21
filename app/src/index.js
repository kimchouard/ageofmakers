import {createStore, applyMiddleware} from 'redux';
import ReduxPromise from 'redux-promise';
import {wrapStore, alias} from 'react-chrome-redux';

import rootReducer from './reducers';
import aliases from './aliases';

// Store with middleware
const middlewares = [ alias(aliases), ReduxPromise ];
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);
const storeWithMiddleware = createStoreWithMiddleware(rootReducer);

wrapStore(storeWithMiddleware, {
  portName: 'ageofmakers',
});
