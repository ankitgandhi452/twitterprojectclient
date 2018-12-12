// Import from NPM
// -------------------------------------
import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { autoRehydrate, persistStore } from "redux-persist";
import localforage from "localforage";
import { composeWithDevTools } from "redux-devtools-extension";

// Import Store Setup
// -------------------------------------
import { Request } from "./Request";
import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import { TweetReducer } from "./tweet/reducer/tweet.react.reducer"
import { AuthenticationReducer } from "./authentication/reducer/Authentication.react.reducer"


//-------------------------------------------------------------------------------------
// Create your app's store
//-------------------------------------------------------------------------------------
const Store = composeWithDevTools(
    applyMiddleware(thunkMiddleware.withExtraArgument(Request)),
    autoRehydrate()
    // ... add additional middleware here (router, etc.)
)(createStore)(combineReducers({
    routing: routerReducer,
    tweet: TweetReducer,
    auth: AuthenticationReducer
}));
//-------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------
// Persist the states of the whitelisted data trees in localForage if available,
// else in fakeLocalStorage
//-------------------------------------------------------------------------------------
const persistStoreConfig = {
    whitelist: [
        "tweet",
        "auth"
    ],
    storage: localforage 
};
//-------------------------------------------------------------------------------------

const getStore = () => {
    return Store.getState();
}

export {
    Store,
    persistStoreConfig,
    persistStore,
    getStore
};
