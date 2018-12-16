import React, { Component } from 'react'
import Link from 'next/link'
import { Menu } from 'semantic-ui-react'
import { getFromStorage } from '~/utils/storage'
import { logoutUser } from '~/utils/api/users'
import Router from 'next/router'

export default class Navbar extends Component {
    render() {
        return (
            <Menu style={{backgroundColor: 'white', borderBottom: '2px solid lightgray', marginBottom: '10px'}} fixed="top" secondary>
                <Link href='/'>
                    <Menu.Item header as="h2">Client Connect</Menu.Item>
                </Link>
                {this.props.loggedIn  ? (
                <Menu.Menu position="right">
                    <Link href="/profile">
                        <Menu.Item as="a" content="Profile"></Menu.Item>
                    </Link>
                    <Link href="/search">
                        <Menu.Item as="a" content="Search"></Menu.Item>
                    </Link>
                    <Menu.Item as="a" content="Logout" onClick={async () => {
                        const obj = getFromStorage('clientconnect')
                        if (obj && obj.token){
                            const { token } = obj
                            const res = await logoutUser(token)
                            if (res.success) {
                                Router.push('/')
                            }
                        }
                    }}></Menu.Item>
                </Menu.Menu>
                ) : (
                <Menu.Menu position="right">
                    <Link href='/login'>
                       <Menu.Item as="a" content="Login" />
                    </Link>
                    <Link href='/register'>
                        <Menu.Item as="a" content="Register" />
                    </Link>
                </Menu.Menu>
                )}
            </Menu>
        );
    }
}
