import React, { Component } from 'react'
import { Grid, Form, Button, Header, Message} from 'semantic-ui-react'
import { registerUser, checkExists, verifyToken } from '~/utils/api/users'
import Router from 'next/router'
import { getFromStorage } from '~/utils/storage'

export default class RegisterForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            firstName: '',
            middleName: '',
            lastName: '',
            email: '',
            userName: '',
            userType: '',
            password: '',
            passwordConfirm: '',
            err: {exists: false, header: '', msg: ''}
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

    handleChange = (e, {name, value}) => {
        this.setState({[name]: value.trim(), err: {exists: false, header: '', msg: ''}})
    }

    handleSubmit = async () => {
        const {userName, password, passwordConfirm} = this.state
        if(password !== passwordConfirm){
            this.setState({ err: {exists: true, header: "Password Mismatch!", msg: "Ensure that the password is typed correctly in both fields."}})
            return
        }
        if(userName.includes(' ')){
            this.setState({ err: {exists: true, header: "Invalid Username", msg: "Username may not contain spaces!"}})
            return
        }
        const userExists = await checkExists(userName)
        if (userExists.exists === true){
            this.setState({ err: {exists: true, header: "Username Taken!", msg: "That username is already taken! Try another."}})
            return
        }
        const res = await registerUser(this.state)
        Router.push("/")
    }

    render() {
        const userTypes = [
            { key: "client", value: "client", text: "Client (Looking FOR Help)"},
            { key: "freelancer", value: "freelancer", text: "Freelancer (Looking TO Help)"}]
        const {firstName, middleName, lastName, userName, userType, err} = this.state
        const suggestedUserName = (() => {
            if (firstName && lastName){
                let mstr = ""
                if (middleName) mstr = middleName.toLowerCase() + "."
                let utstr = ""
                if (userType) utstr = "." + userType
                return firstName.toLowerCase() + "." + mstr + lastName.toLowerCase() + utstr
            }
        })()
        return (
        <div className="register-form">
            <Grid style={{ height: '100%' }} centered verticalAlign="middle">
                <Grid.Column style={{maxWidth: 750, padding: 50}}>
                    <Header as="h1">Create an Account</Header>
                    <Form onSubmit={this.handleSubmit} error={err.exists}>
                        <Form.Group >
                            <Form.Input fluid label="First Name" placeholder="First Name" name="firstName" width={6} required onChange={this.handleChange}/>
                            <Form.Input fluid label="Middle Name" placeholder="Middle Name" name="middleName" width={4} onChange={this.handleChange}/>
                            <Form.Input fluid label="Last Name" placeholder="Last Name" name="lastName" width={6} required onChange={this.handleChange}/>
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Input fluid label="Email" placeholder="Enter email" name="email" type="email" required onChange={this.handleChange}/>
                            <Form.Select fluid name="userType" label="User Type" placeholder="What kind of user are you?" options={userTypes} onChange={this.handleChange} required/>
                        </Form.Group>
                        <Form.Input fluid label="Username" name="userName" placeholder={suggestedUserName || "Enter a username"} required onChange={this.handleChange} error={userName.includes(' ')}/>
                        <Form.Input fluid label="Password" name="password" placeholder="Enter password" type="password" required onChange={this.handleChange}/>
                        <Form.Input fluid label="Confirm Password" name="passwordConfirm" placeholder="Enter password again" type="password" required onChange={this.handleChange} error={this.state.passwordConfirm !== this.state.password}/>
                        <Message error header={err.header} content={err.msg} />
                        <Button type='submit'>Join</Button>
                    </Form>
                </Grid.Column>
            </Grid>
        </div>
        )
    }
}

