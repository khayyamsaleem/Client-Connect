import Link from 'next/link'
import { Grid, Header, Image, Button, Segment, Dimmer, Loader} from 'semantic-ui-react'
import Logo from '~/assets/ClientConnectLogo.svg'
import App from '~/containers/App'
import React, { Component } from 'react'
import { getFromStorage } from '~/utils/storage'
import { verifyToken } from '~/utils/api/users'
import Router from 'next/router'

export default class extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoading: true
        }
    }
    async componentDidMount() {
        const tokenObj = getFromStorage('clientconnect');
        if (tokenObj && tokenObj.token) {
            const { token } = tokenObj;
            // Verify token
            const res = await verifyToken(token)
            if (res.success) {
                this.setState({
                    token
                })
                this.setState({ isLoading: false })
                Router.push("/profile")
            }
        }
        this.setState({isLoading: false})
    }


    render() {
        return (
            <App>
                <div className="landing-page">
                    <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    {this.state.isLoading ? (
                        <Segment>
                            <Dimmer active inverted>
                                <Loader size='large'>Loading</Loader>
                            </Dimmer>

                            <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                        </Segment>
                    ) : (
                        <Grid.Column style={{ maxWidth: 450 }}>
                            <Header as='h2' color='blue' textAlign='center'>
                                <Image src={Logo} style={{ width: '100%' }} />
                                <Link href='/login'>
                                    <Button color="blue" fluid size='large'>
                                        Login
                            </Button>
                                </Link>
                                <div style={{ height: '10px' }}></div>
                                <Link href='/register'>
                                    <Button color="blue" fluid size='large'>
                                        Register
                            </Button>
                                </Link>
                            </Header>
                        </Grid.Column>
                        )}
                    </Grid>
                </div>
            </App >
        )
    }
}

