// Import from NPM
// -------------------------------------
import React from "react";
import { connect } from "react-redux";
import { hashHistory } from "react-router";
import { Container } from 'semantic-ui-react';

// Import Actions and Helpers
// -------------------------------------
import { AuthenticationAction } from "./reducer/Authentication.react.action";

// Import Components
// -------------------------------------
import Login from "./components/Login.react";
import SignUp from "./components/SignUp.react";

class AuthenticationContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: this.props.auth.isUserLoggedIn
        };
    }

    setAuthenticated = () => {
        hashHistory.push({
            pathname: '/tweet',
        });
    };

    render() {
        let isPortrait = window.innerWidth < window.innerHeight;
        let ContainerStyle = { 
            height: "100vh", 
            position: "relative", 
            paddingTop: isPortrait ? "30%" : "10%"
        }
        let component = {};
        switch (this.props.location.pathname) {
            case '/auth/sign_up':
                component = (
                    <SignUp
                        {...this.props}
                        setAuthenticated={this.setAuthenticated}
                    />
                );
                break;
            default:
                component = (
                    <Login
                        {...this.props}
                        setAuthenticated={this.setAuthenticated}
                    />
                );
                break;
        }

        return (
            <Container style={ContainerStyle}>
                {component}
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
	return {
		actions: {
			login: (email, password, domain) => {
				return dispatch(AuthenticationAction.login(email, password, domain));
			},
			signUp: (email, password, domain) => {
				return dispatch(AuthenticationAction.signUp(email, password, domain));
			},
			logout: () => {
				return dispatch(AuthenticationAction.logout());
			}
		}
	};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AuthenticationContainer);
