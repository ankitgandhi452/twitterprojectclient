import React, { Component } from 'react'
import { Icon, Menu } from 'semantic-ui-react'

class TopBar extends Component {
    render(){
        return(
            <Menu>
                <Menu.Item onClick={this.props.handleSidebarToggle}>
                    <Icon name='bars' />
                </Menu.Item>
            </Menu>
        )
    }
}

export {TopBar};