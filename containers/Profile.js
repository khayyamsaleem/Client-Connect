import React, { Component } from 'react'
import LogoutButton from '~/components/LogoutButton'
import { Grid, Header, Segment, Label, Icon, Responsive } from 'semantic-ui-react'
import '~/styles/App.scss'
import { getCurrentUser } from '~/utils/api/users'
import { getProjectsByUser } from '~/utils/api/projects'
import Router from 'next/router'
import AddProject from '~/components/AddProject'

export default class extends Component{
   constructor(props){
        super(props)
        this.state = {
            currentUser: '',
            projects: [],
            isLoading: true
        }
    }

    async componentDidMount(){
        const userObj = await getCurrentUser()
        if (!userObj.success){
            Router.push('/login')
        } else {
            const { projects } = await getProjectsByUser(userObj.currentUser._id)
            this.setState({
                currentUser: userObj.currentUser,
                isLoading: false,
                projects: projects
            })
        }
    }

    render(){
        const { projects } = this.state
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
                                </Segment.Group>
                            </Segment.Group>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Segment.Group id="forceSameSegmentHeight">
                                <Segment><Header as='h3' content="Projects" /></Segment>
                                <Segment.Group>
                                {projects.map((project, i) => {
                                    return (
                                        <Segment.Group key={i}>
                                            <Segment>
                                                <Label horizontal>Title</Label>
                                                {project.title}
                                            </Segment>
                                            <Segment>
                                                <Label horizontal>Description</Label>
                                                {project.description}
                                            </Segment>
                                        </Segment.Group>
                                    )
                                })}
                                </Segment.Group>
                                <AddProject currentuser={this.state.currentUser}/>
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