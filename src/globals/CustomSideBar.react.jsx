import React, { Component } from 'react'
import { Link } from "react-router";
import { Sidebar, Icon, Menu } from 'semantic-ui-react'

class CustomSideBar extends Component {
    render(){
      let isPortrait = window.innerWidth < window.innerHeight;
      let animation = isPortrait ? 'slide along' : 'overlay'
        return(
            <Sidebar
            as={Menu}
            animation={animation}
            icon='labeled'
            inverted
            onHide={this.props.handleSidebarHide}
            vertical
            visible={this.props.visible}
            width='thin'
          >
            <Menu.Item as='div'>
              <Link to="/tweet">
                <Icon name='feed' />
                Tweet
              </Link>
            </Menu.Item>
            <Menu.Item as='div'>
                <Link to="/tweet/search">
                <Icon name='search' />
                Tweet Search
              </Link>
            </Menu.Item>
            <Menu.Item as='div'>
                <Link to="/tweet/new">
                <Icon name='plus' />
                New Tweet
              </Link>
            </Menu.Item>
          </Sidebar>
        )
    }
}

export {CustomSideBar};