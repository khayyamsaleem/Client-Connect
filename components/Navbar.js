import React, { Component } from 'react'
import Link from 'next/link'
import { Menu } from 'semantic-ui-react'

export default class Navbar extends Component {
    render() {
        return (
            <Menu fixed="top" secondary>
                <Link href='/'>
                    <Menu.Item header>Client Connect</Menu.Item>
                </Link>
                <Menu.Menu position="right">
                    <Link href='/login'>
                        <Menu.Item as="a" content="Login" />
                    </Link>
                    <Link href='/register'>
                        <Menu.Item as="a" content="Register" />
                    </Link>
                </Menu.Menu>
            </Menu>
        );
    }
}
