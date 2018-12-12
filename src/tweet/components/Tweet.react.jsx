import React, { Component } from "react";
import _ from 'lodash';
import { Feed, Icon, Form, Button, Comment, Segment } from 'semantic-ui-react';

import CustomComment from './CustomComment.react'

class Tweet extends Component {
    constructor(props){
        super(props)
        this.emailToName = this.emailToName.bind(this);
        this.toggleComments = this.toggleComments.bind(this);
        this.state = {
            commentCollapsed: true,
            comment: "",
            addBtnEnable: false,
            tweetId: this.props.tweet._id.$oid
        }
    }

    emailToName(email){
        return _.join(_.split(_.split(email, "@")[0], "."), " ")
    }

    toggleComments(){
        this.setState({commentCollapsed: !this.state.commentCollapsed})
    }

    handleChange = e => {
        this.setState({ comment: e.target.value }, function() {
            if (this.state.comment !== "")
                this.setState({ addBtnEnable: true });
            else this.setState({ addBtnEnable: false });
        });
    };

    render(){
        let tweet = this.props.tweet;
        console.log(tweet)
        console.log(_.size(tweet.comments))
        let comments = _.map(this.props.tweet.comments, function(comment, index){
            return <CustomComment
                comment={comment}
                key={index}
            />
        })
        return(
            <Segment style={{margin: "0"}}>
                <Feed>
                    <Feed.Event>
                        <Feed.Label image='assets/images/avatar.jpg' />
                        <Feed.Content>
                            <Feed.Summary>
                            <a>{this.emailToName(tweet.user.email)}</a> posted
                            <Feed.Date>3 days ago</Feed.Date>
                            </Feed.Summary>
                            <Feed.Extra text>
                            {tweet.text}
                            </Feed.Extra>
                            <Feed.Meta>
                                <Feed.Like onClick={this.toggleComments}>
                                    <Icon name='comments' />
                                    {_.size(tweet.comments)} Comments
                                </Feed.Like>
                                <Comment.Group collapsed={this.state.commentCollapsed}>
                                    {comments}
                                    <Form reply onSubmit={() => {this.props.addComment(this.state.comment, this.state.tweetId)}}>
                                        <Form.TextArea 
                                            onChange={this.handleChange}
                                            value={this.state.comment}
                                        />
                                        <Button content='Comment' labelPosition='left' icon='edit' primary disabled={!this.state.addBtnEnable} />
                                    </Form>
                                </Comment.Group>
                            </Feed.Meta>
                        </Feed.Content>
                    </Feed.Event>
                </Feed>
            </Segment>
        );
    }
}

export default Tweet;
