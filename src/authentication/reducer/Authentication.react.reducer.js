import _ from 'lodash';
import { LOGIN, LOGOUT, SIGNUP } from './Authentication.react.action';
import { REHYDRATE } from 'redux-persist/constants';

const initialAuthState = {
    error: {},
    status: "",
    user: null,
    isUserLoggedIn: false,
};

const AuthenticationReducer = (state = initialAuthState, action) => {
	switch (action.type) {
		case REHYDRATE:
			let auth = action.payload.auth;
			if (auth) {
				return { ...state, ...auth }
			} else {
				return state;
			}
		case LOGIN:
			if (action.status === 'authenticating') {
				return {...state, status: action.status, error: {}}
			}
			else if(action.status === 'success') {
				return { ...state, status: action.status, user: { ...action.data}, isUserLoggedIn: true, error: {}};
			}
			else if(action.status === 'error')
				return {...state, status: action.status, error: action.err};
			else {
				return state;
			}
		case SIGNUP:
			if (action.status === 'authenticating') {
				return {...state, status: action.status, error: {}}
			}
			else if(action.status === 'success') {
				return { ...state, status: action.status, user: { ...action.data}, isUserLoggedIn: true, error: {}};
			}
			else if(action.status === 'error')
				return {...state, status: action.status, error: action.err};
			else {
				return state;
			}
		case LOGOUT:
			if (action.status === 'authenticating') {
				return {...state, status: action.status, error: {}}
			}
			else if(action.status === 'success') {
				return {...state, status: action.status, user: null, isUserLoggedIn: false, error: {}};
			}
			else if(action.status === 'error')
				return {...state, status: action.status, user: null, isUserLoggedIn: false, error: action.err};
			else {
				return state;
			}
		default:
			return state;
	}
};

export { AuthenticationReducer };
