import React, { Component } from 'react'
import Head from 'next/head'
import Navbar from '~/components/Navbar'
import Favicon from '~/assets/favicon.ico'
import "~/styles/App.scss"
import { getFromStorage} from '~/utils/storage'
import { verifyToken } from '~/utils/api/users'

export default class App extends Component {
    constructor(props){
        super(props)
        this.state = {
            loggedIn: false
        }
    }
    async componentDidMount() {
        const tokenObj = getFromStorage('clientconnect');
        if (tokenObj && tokenObj.token) {
            const { token } = tokenObj;
            // Verify token
            const res = await verifyToken(token)
            if (res.success){
                this.setState({
                    loggedIn: true
                })
            }
        }
    }
    render() {
        return (
            <>
                <Head>
                    <title>Client Connect</title>
                    <link rel="icon" type="image/ico" href={Favicon}></link>
                    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
                </Head>
                <div className="App">
                    <Navbar loggedIn={this.state.loggedIn}/>
                    {this.props.children}
                </div>
            </>
        );
    }
}
