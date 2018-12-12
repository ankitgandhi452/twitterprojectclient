import React, { Component } from 'react'
import _ from 'lodash';
import { Link } from "react-router";
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isFetching: false,
            errorRaised: false,
            errorMessages: []
        };
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

    handleSubmit = () => {
        const { email, password } = this.state;
        this.setState({ isFetching: true });
        this.props.actions
            .login(email, password, this.props.apiUrl)
            .then(response => {
                if (this.props.auth.status === "error") {
                    this.setState({
                        isFetching: false,
                        errorRaised: true,
                        errorMessages: response.err.errors
                    });
                } else {
                    this.props.setAuthenticated();
                }
            })
            .catch(error => {
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
                    <Header as='h2' color='teal' textAlign='center'>
                     Log-in to your account
                    </Header>
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
                            icon='user' 
                            iconPosition='left' 
                            placeholder='E-mail address'
                            onChange={this.handleChange}
                            name="email"
                            value={this.state.email}
                        />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChange}
                        />

                        <Button color='teal' fluid size='large'>
                        Login
                        </Button>
                    </Segment>
                    </Form>
                    <Message>
                    New to us? <Link to='/auth/sign_up'>Sign Up</Link>
                    </Message>
                    <Message>
                    Want to? <Link to='/tweet/search'>Search Tweets</Link>
                    </Message>
                </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Login