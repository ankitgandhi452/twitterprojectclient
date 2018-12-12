import React, { Component } from "react";
import { Comment } from 'semantic-ui-react';
class CustomComment extends Component {

    render(){
        let comment = this.props.comment;
        return(
            <Comment>
                <Comment.Avatar as='a' src='assets/images/avatar.jpg' />
                <Comment.Content>
                <Comment.Author as='a'>Christian Rocha</Comment.Author>
                <Comment.Metadata>
                    <span>2 days ago</span>
                </Comment.Metadata>
                <Comment.Text>
                    {comment.text}
                </Comment.Text>
                </Comment.Content>
            </Comment>
        )
    }

}

export default CustomComment;