import React, { Component } from 'react'
import { Grid, Form, Segment, Button, Header, Image} from 'semantic-ui-react'
import Logo from '~/assets/ClientConnectLogo.svg'

export default class Login extends Component {
    render() {
        return (
            <div className="login-form">
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign="middle">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='blue' textAlign='center'>
                        <Image src={Logo} style={{width: "100%"}}/>
                    </Header>
                    <Form size='large'>
                    <Segment stacked>
                        <Form.Input fluid icon='user' iconPosition='left' placeholder="Username" />
                        <Form.Input fluid icon='lock' iconPosition='left' placeholder="Password" type="password"/>
                        <Button color="blue" fluid size='large'>
                            Login
                        </Button>
                    </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        </div>
    )
}
}
