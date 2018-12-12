import React, { Component } from 'react'
import _ from 'lodash';
import { Button, Form, Grid, Message, Segment } from 'semantic-ui-react'
import { hashHistory } from "react-router";

class NewTweet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            isFetching: false,
            errorRaised: false,
            errorMessages: []
        };
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

    handleSubmit = () => {
        const { text } = this.state;
        this.setState({ isFetching: true });
        this.props.actions
            .addTweet(text)
            .then(response => {
                if (response.status === "error") {
                    this.setState({
                        isFetching: false,
                        errorRaised: true,
                        errorMessages: response.err.errors
                    });
                } else {
                    hashHistory.push('/tweet')
                }
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    isFetching: false,
                    errorRaised: true,
                    errorMessages: error.errors
                });
            });
    };

    getErrors = () => {
        let error = "";
        if (this.props.location.query) {
            error = this.props.location.query.message;
        }
        if (this.state.errorRaised) {
            error = _.join(this.state.errorMessages, "\n");
        }
        return error;
    };


    render(){
        return(
                <div className='login-form'>
                    {/*
                    Heads up! The styles below are necessary for the correct render of this example.
                    You can do same with CSS, the main idea is that all the elements up to the `Grid`
                    below must have a height of 100%.
                    */}
                    <style>{`
                    body > div,
                    body > div > div,
                    body > div > div > div.login-form {
                        height: 100%;
                    }
                    `}</style>
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Form size='large' loading={this.state.isFetching ? true : false}
                    error={
                        this.state.errorRaised
                            ? true
                            : this.props.location.query
                                ? true
                                : false
                    }
                    onSubmit={this.handleSubmit}>
                    <Message error content={this.getErrors()} />
                    <Segment stacked>
                        <Form.Input 
                            fluid 
                            icon='feed' 
                            iconPosition='left' 
                            placeholder='Tweet Text'
                            onChange={this.handleChange}
                            name="text"
                            value={this.state.text}
                        />
                        <Button color='teal' fluid size='large'>
                        Submit
                        </Button>
                    </Segment>
                    </Form>
                </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default NewTweet