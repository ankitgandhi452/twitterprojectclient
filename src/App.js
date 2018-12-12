import React, { Component } from 'react';
import { Router, Route, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import localforage from "localforage";
import Loadable from 'react-loadable';
import './App.css';
import 'semantic-ui-css/semantic.min.css'

// Import from Config
// -------------------------------------
import {
  Store,
  persistStore,
  persistStoreConfig
} from "./store";

// Import Components
// --------------------------------------------
import { Loading } from './globals/Loading.react';
const TweetContainer = Loadable({
	loader: () => import('./tweet/TweetContainer.react'),
	loading: Loading,
});

const TweetSearchContainer = Loadable({
	loader: () => import('./tweet/TweetSearchContainer.react'),
	loading: Loading,
});

const AuthenticationContainer = Loadable({
	loader: () => import('./authentication/AuthenticationContainer.react'),
	loading: Loading,
});


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rehydrated: false
    };
    this.requireLogin = this.requireLogin.bind(this);
    this.alreadyLoggedIn = this.alreadyLoggedIn.bind(this);
    this.manageStore = window.manageStore = this.manageStore.bind(this);
    this.manageStore();
  }

  manageStore = purge => {
    if (purge === "purge") {
      persistStore(Store, persistStoreConfig).purge();
    } else {
      persistStore(Store, persistStoreConfig, () => {
        let existing_user = window.localStorage.getItem("reduxPersist:auth");
        if (existing_user) {
          localforage.setItem("reduxPersist:auth", existing_user);
        }
        this.setState({ rehydrated: true });
      });
    }
  };

  requireLogin(nextState, replace, callback) {
    const unauthRoot = "/auth/sign_in";
    const auth = Store.getState().auth;
    if (!auth.isUserLoggedIn) {
      replace(unauthRoot);
    }

    callback();
  }

  alreadyLoggedIn(nextState, replace, callback) {
    const authRoot = "/tweet";
    const auth = Store.getState().auth;
    if (auth.isUserLoggedIn) {
      replace(authRoot);
    }
    callback();
  }

  render() {
    let returnValue = (
      <div
        style={{
          height: "100%",
          position: "relative"
        }}
      >
        <Router history={syncHistoryWithStore(hashHistory, Store)}>
        <Route
            exact
            path="/"
            component={AuthenticationContainer}
            onEnter={this.alreadyLoggedIn}
          />
          <Route
            exact
            path="/auth/sign_in"
            component={AuthenticationContainer}
            onEnter={this.alreadyLoggedIn}
          />
          <Route
            exact
            path="/auth/sign_up"
            component={AuthenticationContainer}
            onEnter={this.alreadyLoggedIn}
          />
          <Route
            exact
            path="/tweet"
            component={TweetContainer}
            onEnter={this.requireLogin}
          />
          <Route
            exact
            path="/tweet/new"
            component={TweetContainer}
            onEnter={this.requireLogin}
          />
          <Route
            exact
            path="/tweet/search"
            component={TweetSearchContainer}
          />
        </Router>
      </div>
    );
      if (!this.state.rehydrated) {
        returnValue = <div>Loading</div>;
      }
      return returnValue;
  }
}

export default App;
