import React, { Component } from 'react'
import { Grid, Form, Segment, Button, Header, Image, Message } from 'semantic-ui-react'
import Logo from '~/assets/ClientConnectLogo.svg'
import { loginUser, checkExists, verifyToken } from '~/utils/api/users'
import { setInStorage, getFromStorage} from '~/utils/storage'
import Router from 'next/router'

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: '',
            password: '',
            err: { exists: false, header: '', msg: '' },
            isLoading: false,
            token: ''
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        this.setState({ isLoading: true })
        const { userName, password } = this.state
        const userExists = await checkExists(userName)
        if (userExists.exists === false) {
            this.setState({ isLoading: false, err: { exists: true, header: "No Such User!", msg: "Ensure your username is typed correctly" } })
            return
        }
        const res = await loginUser(userName, password)
        if (res.auth_error) {
            this.setState({ isLoading: false, err: { exists: true, header: "Incorrect Password!", msg: "Ensure your password is typed correctly" } })
            return
        }
        if (res.success) {
            setInStorage('clientconnect', { token: res.token })
            this.setState({ isLoading: false, token: res.token, userName: '', password: '', err: { exist: false } })
            Router.push("/profile")
        } else {
            this.setState({ isLoading: false, err: { exists: true, header: "Server Error!", msg: "Please don't fail us" } })
        }
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value, err: { exists: false, header: '', msg: '' } })
    }

    async componentDidMount() {
        const tokenObj = getFromStorage('clientconnect');
        if (tokenObj && tokenObj.token) {
            const { token } = tokenObj;
            // Verify token
            const res = await verifyToken(token)
            if (res.success){
                this.setState({
                    token,
                    isLoading: false
                })
                Router.push('/profile')
            } else {
                this.setState({isLoading: false})
            }
        } else {
            this.setState({isLoading: false})
        }
    }


    render() {
        const state = this.state
        return (
            <div className="login-form">
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign="middle">
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='blue' textAlign='center'>
                            <Image src={Logo} style={{ width: "100%" }} />
                        </Header>
                        <Form size='large' error={state.err.exists} onSubmit={this.handleSubmit} loading={state.isLoading}>
                            <Segment stacked>
                                <Form.Input fluid icon='user' iconPosition='left' name='userName' placeholder="Username" onChange={this.handleChange} />
                                <Form.Input fluid icon='lock' iconPosition='left' name='password' placeholder="Password" onChange={this.handleChange} type="password" />
                                <Button type="submit" color="blue" fluid size='large' content="Login"/>
                                <Message error header={state.err.header} content={state.err.msg} />
                            </Segment>
                        </Form>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}
