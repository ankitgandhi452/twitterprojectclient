import _ from 'lodash'
import React, { Component } from 'react'
import { Search, Grid, Segment, Sidebar } from 'semantic-ui-react'
import TweetAction from './reducer/tweet.react.action'
import { connect } from "react-redux";
import { Loading } from '../globals/Loading.react';
import { TopBar } from '../globals/TopBar.react';
import { CustomSideBar } from '../globals/CustomSideBar.react';

class TweetSearchContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            sideBarVisible: false,
            fetchComplete: false,
            options: []
        }
        this.handleSidebarHide = this.handleSidebarHide.bind(this)
        this.handleSidebarToggle = this.handleSidebarToggle.bind(this)
    }

    handleSidebarHide(){
        this.setState({sideBarVisible: false})
    }

    handleSidebarToggle(){
        this.setState({sideBarVisible: !this.state.sideBarVisible})
    }

    componentDidMount(){
        this.props.actions.fetchTweet()
        .then((tweets) => {
            let searchOptions = _.map(tweets.data.tweets, function(tweet){
                return {
                    title: tweet.text,
                    description: tweet.user.email + " created at " + tweet.created_at,
                    image: "assets/images/avatar.jpg"
                }
            })
            this.setState({fetchComplete: true, options: searchOptions})
        })
        .catch((e) => {
            console.log(e)
        })
    }

    componentWillMount() {
        this.resetComponent()
    }

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => this.setState({ value: result.title })

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value })

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent()

            const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
            const isMatch = result => re.test(result.title)

            this.setState({
            isLoading: false,
            results: _.filter(this.state.options, isMatch),
            })
        }, 300)
    }

    render() {
        let isPortrait = window.innerWidth < window.innerHeight;
        let wrapperStyle = {
            width: isPortrait ? "100vw" : "60%",
            height: "100%",
            margin: '0 auto',
        }
        const { isLoading, value, results } = this.state
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
                            <Grid>
                                <Grid.Column width={16} textAlign="center">
                                    <Search
                                    fluid
                                    size="big"
                                    loading={isLoading}
                                    onResultSelect={this.handleResultSelect}
                                    onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
                                    results={results}
                                    value={value}
                                    {...this.props}
                                    />
                                </Grid.Column>
                            </Grid>
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
            }
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(TweetSearchContainer);

