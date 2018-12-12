import React, { Component } from "react";
import _ from 'lodash';
import TweetAction from './reducer/tweet.react.action'
import { connect } from "react-redux";
import { Loading } from '../globals/Loading.react';
import { TopBar } from '../globals/TopBar.react';
import { CustomSideBar } from '../globals/CustomSideBar.react';
import Tweet from './components/Tweet.react'
import NewTweet from './components/NewTweet.react'
import { Feed, Segment, Sidebar } from 'semantic-ui-react';

class TweetContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            sideBarVisible: false,
            fetchComplete: false,
        }
        this.handleSidebarHide = this.handleSidebarHide.bind(this)
        this.handleSidebarToggle = this.handleSidebarToggle.bind(this)
        this.addComment = this.addComment.bind(this)
    }

    handleSidebarHide(){
        this.setState({sideBarVisible: false})
    }

    handleSidebarToggle(){
        this.setState({sideBarVisible: !this.state.sideBarVisible})
    }

    addComment = (comment, tweetId) => {
        console.log(comment)
        console.log(tweetId)
        if (comment !== "\n") {
            this.props.actions.addComment(tweetId, comment)
            .then(() => {
                window.location.reload()
            })
            .catch(err => {
            });
        }
    };

    componentDidMount(){
        this.props.actions.fetchTweet()
        .then(() => {
            this.setState({fetchComplete: true})
        })
        .catch((e) => {
            console.log(e)
        })
    }
    

    render(){
        let isPortrait = window.innerWidth < window.innerHeight;
        let wrapperStyle = {
            width: isPortrait ? "100vw" : "60%",
            height: "100%",
            margin: '0 auto',
        }
        let that = this;
        let tweet = _.map(this.props.tweet.tweets, function(tweet, index){
            return <Tweet
                tweet={tweet}
                key={index}
                addComment={that.addComment}
            />
        })
        let component = {};
        switch (this.props.location.pathname) {
            case '/tweet/new':
                component = (
                    <NewTweet
                        {...this.props}
                    />
                );
                break;
            default:
                component = (
                    <Feed>{tweet}</Feed>
                );
                break;
        }
        
        if (!this.state.fetchComplete) return <Loading size="massive" />;
        else return (
            <Sidebar.Pushable as={Segment}>
                <CustomSideBar 
                    visible={this.state.sideBarVisible}
                    handleSidebarHide={this.handleSidebarHide}
                />
                <Sidebar.Pusher dimmed={this.state.sideBarVisible}>
                    <div style={{height: "100%"}}>
                        <Segment style={wrapperStyle} basic={isPortrait}>
                            <TopBar 
                                handleSidebarToggle={this.handleSidebarToggle}
                            ></TopBar>
                            {component}
                        </Segment>
                    </div>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}

const mapStateToProps = state => {
    return {
        tweet: state.tweet,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: {
            fetchTweet: () => {
                return dispatch(TweetAction.fetchTweet());
            },
            addComment: (tweetId, comment) => {
                return dispatch(TweetAction.addComment(tweetId, comment))
            },
            addTweet: (tweetText) => {
                return dispatch(TweetAction.addTweet(tweetText))
            }
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(TweetContainer);
