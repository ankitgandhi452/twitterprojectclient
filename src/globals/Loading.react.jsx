// Import from NPM
// -------------------------------------
import React from "react";
import { Image, Loader } from "semantic-ui-react";
import logo from '../../src/logo.svg';

class Loading extends React.Component {
    render() {
        let isPortrait = window.innerWidth < window.innerHeight;
        let wrapperStyle = {
            height: "100vh",
            width: "100vw",
            background: "#eae9e9de",
            position: "relative",
            overflow: "hidden"
        };
        let logoStyle = {
            position: "absolute",
            left: "50%",
            top: "15%",
            transform: "translate(-50%,0)",
            width: "20%",
            maxWidth: "100%"
        };
        return (
            <div style={wrapperStyle}>
                <Loader size="massive" active>
                    {!this.props.inGame &&
                        !this.props.offline && (
                            <p>{"LOADING YOUR CONTENT..."}</p>
                        )}
                </Loader>
            </div>
        );
    }
}

export { Loading };
