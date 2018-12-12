import _ from 'lodash';
export const FETCH_TWEET = 'FETCH_TWEET';
export const ADD_COMMENT = 'ADD_COMMENT';
export const ADD_TWEET = 'ADD_TWEET';

const _fetchTweet = (status, data, err) => {
    return {
        type: FETCH_TWEET,
        data,
        err,
        status
    }
}

const _addComment = (status, data, err) => {
    return {
        type: ADD_COMMENT,
        data,
        err,
        status
    }
}

const _addTweet = (status, data, err) => {
    return {
        type: ADD_TWEET,
        data,
        err,
        status
    }
}

const fetchTweet = () => {
    return (dispatch, getState, Request) => {
        dispatch(_fetchTweet("fetching", null, null));
        return Request.fetch('/tweets.json')
            .then((response) => {
                return response.json().then((data) => {
                    return dispatch(_fetchTweet("success", {tweets: data}, null));
                })
            })
            .catch((err) => {
                dispatch(_fetchTweet("error", null, err));
                return Promise.reject(err)
            })

    }
};

const addComment = (tweetId, comment) => {
    return (dispatch, getState, Request) => {
        dispatch(_addComment("fetching", null, null));
        return Request.fetch('/tweets/' + tweetId + '/comments',{
            method: 'POST',
            body: {
                "comment": {
                    "text": comment
                }
            },
        })
            .then((response) => {
                return response.json().then((data) => {
                    return dispatch(_addComment("success", {comment: data}, null));
                })
            })
            .catch((err) => {
                dispatch(_addComment("error", null, err));
                return Promise.reject(err)
            })

    }
};

const addTweet = (tweetText) => {
    return (dispatch, getState, Request) => {
        dispatch(_addTweet("fetching", null, null));
        return Request.fetch('/tweets/',{
            method: 'POST',
            body: {
                "tweet": {
                    "text": tweetText,
                    "user": "5c0ec54400cbc62ab89ceb3a"
                }
            },
        })
            .then((response) => {
                return response.json().then((data) => {
                    console.log(data)
                    return dispatch(_addTweet("success", {tweet: [data]}, null));
                })
            })
            .catch((err) => {
                dispatch(_addTweet("error", null, err));
                return Promise.reject(err)
            })

    }
};

class TweetAction {
    static fetchTweet = fetchTweet;
    static addComment = addComment;
    static addTweet = addTweet;
}

export default TweetAction;