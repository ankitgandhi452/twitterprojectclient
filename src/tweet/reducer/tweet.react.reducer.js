import _ from 'lodash';
import {FETCH_TWEET, ADD_COMMENT, ADD_TWEET} from './tweet.react.action';
import {REHYDRATE} from 'redux-persist/constants';

const initialTweetState = {
    "tweets": [],
    "error": null
};

const TweetReducer = (state = initialTweetState, action) => {
    switch (action.type) {
        case REHYDRATE:
            let tweet = action.payload.tweet;
            if (tweet) {
                return {...state, ...tweet}
            } else {
                return state;
            }
        case FETCH_TWEET:
            if (action.status === "fetching") {
                return {...state, error: null};
            } else if (action.status === "success") {
                return _.merge({}, state, action.data, {error: null});
            } else {
                return {...state, error: action.err};
            }
        case ADD_TWEET:
            console.log(action)
            if (action.status === "fetching") {
                return {...state, error: null};
            } else if (action.status === "success") {
                return _.merge({}, state, {tweets: _.concat(action.data.tweet, state.tweets), error: null});
            } else {
                return {...state, error: action.err};
            }
        case ADD_COMMENT:
            return state;
            // if (action.status === "fetching") {
            //     return {...state, error: null};
            // } else if (action.status === "success") {
            //     return _.merge({}, state, action.data, {error: null});
            // } else {
            //     return {...state, error: action.err};
            // }
        default:
            return state;
    }
};

export {TweetReducer};