import React, { Component } from 'react'
import LogoutButton from '~/components/LogoutButton'
import { Grid, Header, Segment, Button, Label, Form, Icon, Responsive } from 'semantic-ui-react'
import '~/styles/App.scss'
import { getCurrentUser, updateUser } from '~/utils/api/users'
import Router from 'next/router'

export default class extends Component{
   constructor(props){
        super(props)
        this.textinput = React.createRef()
        this.state = {
            currentUser: '',
            isLoading: true
        }
    }

    async componentDidMount(){
        const userObj = await getCurrentUser()

        if (!userObj.success){
            Router.push('/login')
        } else {
            this.setState({currentUser: userObj.currentUser, isLoading: false})
        }
    }

    handleLocationInputChange = e => { this.state.inputValue = e.target.value }
    async handleLocationFormSubmit() {
        await updateUser(this.state.currentUser.userName, "location", this.state.inputValue)
        let updatedUser = this.state.currentUser
        updatedUser.location = this.state.inputValue
        this.setState({currentUser: updatedUser})
    }
    handleLocationClear() {
        let updatedUser = this.state.currentUser;
        updatedUser.location = null
        this.setState({currentUser: updatedUser})
    }

    render(){
        return (
            <div className="profile-page">
                { (!this.state.isLoading) ? (
                <Responsive as={Grid} verticalAlign="middle" style={{ width: '60%', height: '60%'}} id="profileGrid" padded>
                    <Grid.Row columns={2}>
                        <Grid.Column width={6}>
                            <Segment.Group id="forceSameSegmentHeight">
                                <Segment><Header as='h3'>Details</Header></Segment>
                                <Segment.Group>
                                    <Segment>
                                        <Label horizontal>Name</Label>
                                        {this.state.currentUser.firstName + ' ' + this.state.currentUser.lastName}
                                    </Segment>
                                    <Segment>
                                        <Label horizontal>Username</Label>
                                        {this.state.currentUser.userName}
                                    </Segment>
                                    <Segment>
                                        <Label horizontal>Account Type</Label>
                                        {this.state.currentUser.userType}
                                    </Segment>
                                    <Segment>
                                        <Label horizontal>Join Date</Label>
                                        {new Date(this.state.currentUser.joinDate).toLocaleDateString('en-US')}
                                    </Segment>
                                    {
                                        this.state.currentUser.location ? 
                                        <Segment>
                                            <Label horizontal>Location</Label>
                                            {this.state.currentUser.location}
                                            <Button style={{marginLeft: 10}} content="Clear" size="mini" onClick={this.handleLocationClear.bind(this)}/>
                                        </Segment> :

                                        <Segment>
                                            <Label horizontal>Location</Label>
                                            <Form onSubmit={this.handleLocationFormSubmit.bind(this)}>
                                                <Form.Input placeholder="Location..." onChange={this.handleLocationInputChange.bind(this)}/>
                                            </Form>
                                        </Segment>
                                    }
                                </Segment.Group>
                            </Segment.Group>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Segment.Group id="forceSameSegmentHeight">
                                <Segment><Header as='h3' content="Projects" /></Segment>
                                <Segment.Group>
                                    <Segment textAlign="center">
                                        <Icon name="plus square outline" size="huge"/>
                                    </Segment>
                                    <Segment textAlign="center">Add a New Project!</Segment>
                                </Segment.Group>
                            </Segment.Group>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign="center">
                        <Grid.Column>
                            <LogoutButton />
                        </Grid.Column>
                    </Grid.Row>
                </Responsive>
                ) : <p></p> }
            </div>
        )
    }
}