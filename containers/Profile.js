import React, { Component } from 'react'
import { Grid, Header, Segment, Label, Responsive, Form, Modal, Button, Checkbox} from 'semantic-ui-react'
import Router from 'next/router'

import LogoutButton from '~/components/LogoutButton'
import LocationInput from '~/components/LocationInput'
import AddProject from '~/components/AddProject'
import LiveChat from '~/components/Chat'

import { getCurrentUser, updateSkills, getUserById, updateUser } from '~/utils/api/users'
import { getProjectsByUser, toggleProjectCompletionStatus } from '~/utils/api/projects'
import { joinRoom } from '~/utils/api/chat'
import allSkills from '~/utils/skills'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: {},
            projects: [],
            isLoading: true,
            skills: [],
            freelancerForSelectedProj: {},
            ownerForSelectedProj: {}
        }
    }

    async componentDidMount() {
        const userObj = await getCurrentUser()
        if (!userObj.success) {
            Router.push('/login')
        } else {
            const { projects } = await getProjectsByUser(userObj.currentUser._id)
            this.setState({
                currentUser: userObj.currentUser,
                isLoading: false,
                projects: projects,
                skills: userObj.currentUser.skills,
            })
        }
    }

    updateUser(newUser) { this.setState({currentUser: newUser}) }

    getUser() { return this.state.currentUser }
    

    async handleClear() {
        let updatedUser = this.state.currentUser
        updatedUser.location = null
        this.setState({currentUser: updatedUser})
        await updateUser(updatedUser.userName, "location", null)
    }


    updateSkills = async (e) => {
        e.preventDefault()
        const { skills, currentUser } = this.state
        await updateSkills(currentUser._id, skills)
    }

    toggleSkill = async (e) => {
        let { skills, currentUser } = this.state
        if (e.target.checked) {
            if (!skills.includes(e.target.value)) {
                skills.push(e.target.value)
                currentUser.skills = skills
                this.setState({ skills, currentUser })
            }
        } else {
            skills = skills.filter(s => s !== e.target.value)
            currentUser.skills = skills
            this.setState({ skills, currentUser })
        }
        this.updateSkills()
    }

    getMembersForSelectedProj = async (freelancerId, ownerId) => {
        if (freelancerId) {
            const freelancer = await getUserById(freelancerId)
            this.setState({freelancerForSelectedProj : freelancer.user})
            //send post request to /api/messages/user
            console.log("ATTEMPTING TO JOIN ROOM AS " + this.state.currentUser.userName)
            await joinRoom(this.state.currentUser.userName)
        }
        const owner = await getUserById(ownerId)
        this.setState({ownerForSelectedProj : owner.user})
    }

    getOwnerForProj = async (userId) => {
        const owner = await getUserById(userId)
        this.setState({ownerForSelectedProj : owner.user})
    }

    toggleProjectComplete = async (project) => {
        const result = await toggleProjectCompletionStatus(project._id)
        const { projects } = await getProjectsByUser(this.state.currentUser._id)
        this.setState({projects})
    }

    render() {
        const { projects, currentUser, skills, freelancerForSelectedProj, ownerForSelectedProj} = this.state
        return (
            <div className="profile-page">
                {(!this.state.isLoading) ? (
                    <Responsive as={Grid} verticalAlign="middle" style={{ width: '80%', height: '60%' }} id="profileGrid" padded>
                        <Grid.Row columns={2}>
                            <Grid.Column width={6}>
                                <Segment.Group id="forceSameSegmentHeight">
                                    <Segment><Header as='h3'>Details</Header></Segment>
                                    <Segment.Group>
                                        <Segment>
                                            <Label horizontal>Name</Label>
                                            {currentUser.firstName + ' ' + currentUser.lastName}
                                        </Segment>
                                        <Segment>
                                            <Label horizontal>Username</Label>
                                            {currentUser.userName}
                                        </Segment>
                                        <Segment>
                                            <Label horizontal>Account Type</Label>
                                            {currentUser.userType}
                                        </Segment>
                                        <Segment>
                                            <Label horizontal>Join Date</Label>
                                            {new Date(currentUser.joinDate).toLocaleDateString('en-US')}
                                        </Segment>
                                        {
                                            currentUser.location ? 
                                            <Segment>
                                                <Label horizontal>Location</Label>
                                                <Segment>
                                                    {currentUser.location.display_name}
                                                    <Button style={{marginLeft: 10}} content="Clear" size="mini" onClick={this.handleClear.bind(this)}/>
                                                </Segment>
                                            </Segment> :
                                            <Segment>
                                                <Label horizontal>Location</Label>
                                                <LocationInput setUser={this.updateUser.bind(this)} getUser={this.getUser.bind(this)}/>
                                            </Segment>
                                        }
                                        {(currentUser.userType === 'freelancer') ? (
                                            <Segment>
                                                <Label horizontal>Skills</Label>
                                                {currentUser.skills.join(", ")}
                                            </Segment>
                                        ) : <div></div>}
                                    </Segment.Group>
                                </Segment.Group>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Segment.Group id="forceSameSegmentHeight">
                                    <Segment><Header as='h3' content="Projects" /></Segment>
                                    <Segment.Group>
                                        {(projects.length > 0) ? projects.map((project, i) => {
                                            return (
                                                <Modal key={i} trigger={
                                                <Segment.Group onClick={() => this.getMembersForSelectedProj(project.freelancer, project.owner)} style={{backgroundColor: (project.freelancer ? 'lightblue' : '')}}>
                                                    <Segment>
                                                        <Label horizontal>Title</Label>
                                                        {project.title}
                                                    </Segment>
                                                    <Segment>
                                                        <Label horizontal>Description</Label>
                                                        {project.description}
                                                    </Segment>
                                                </Segment.Group>}>
                                                    <Modal.Content>
                                                    <Segment.Group>
                                                        <Segment>
                                                            <Label horizontal>Title</Label>
                                                            {project.title}
                                                        </Segment>
                                                        <Segment>
                                                            <Label horizontal>Description</Label>
                                                            {project.description}
                                                        </Segment>
                                                        <Segment>
                                                            <Label horizontal>Required Skills</Label>
                                                            {project.skills.join(", ")}
                                                        </Segment>
                                                        {(project.freelancer) ?
                                                        <>
                                                        <Segment>
                                                            {(currentUser.userType === 'client') ? <>
                                                            <Label horizontal>Assigned To</Label>
                                                            {freelancerForSelectedProj.userName} </>
                                                            : <><Label horizontal>Project Owner</Label>{ownerForSelectedProj.userName}</>}
                                                        </Segment>
                                                        {(currentUser.userType === 'client') ? (
                                                            <Segment>
                                                                <Label horizontal>Completed?</Label>
                                                                <Checkbox checked={project.completed} onChange={() => {this.toggleProjectComplete(project)}}/>
                                                            </Segment>
                                                        ) : <div></div>}
                                                        <Segment.Group>
                                                            <Segment><Header as='h3'>Start Chatting</Header></Segment>
                                                            <Segment.Group>
                                                                <Segment>
                                                                    {currentUser.userType === 'freelancer' ? 
                                                                        <LiveChat currentuser={currentUser} recipient={ownerForSelectedProj}/> :
                                                                        <LiveChat currentuser={currentUser} recipient={freelancerForSelectedProj}/>}
                                                                </Segment>
                                                            </Segment.Group>
                                                        </Segment.Group>
                                                        </>
                                                        : <div></div>}
                                                    </Segment.Group>
                                                    </Modal.Content>
                                                </Modal>
                                            )
                                        }) : <Segment textAlign="center"><Header as="h4" content="None Yet!" /></Segment>}
                                    </Segment.Group>
                                    {(currentUser.userType === 'freelancer') ? <div></div> : <AddProject currentuser={this.state.currentUser} />}
                                </Segment.Group>
                            </Grid.Column>
                        </Grid.Row>
                        {(currentUser.userType === 'client') ? <div></div> : (
                            <Grid.Row>
                                <Grid.Column>
                                    <Segment.Group>
                                        <Segment><Header as='h3' content="Skills" /></Segment>
                                        <Segment>
                                            <Form>
                                                <Form.Group inline>
                                                    {allSkills.slice(0, Math.floor(allSkills.length / 3)).map((skill, i) =>
                                                        <Form.Input onChange={this.toggleSkill} name={skill} key={i} type="checkbox" label={skill} value={skill} checked={skills.includes(skill)} />)}
                                                </Form.Group>
                                                <Form.Group inline>
                                                    {allSkills.slice(Math.floor(allSkills.length / 3), Math.floor(allSkills.length / 3) * 2).map((skill, i) =>
                                                        <Form.Input onChange={this.toggleSkill} name={skill} key={i} type="checkbox" label={skill} value={skill} checked={skills.includes(skill)} />)}
                                                </Form.Group>
                                                <Form.Group inline>
                                                    {allSkills.slice(Math.floor(allSkills.length / 3) * 2, allSkills.length).map((skill, i) =>
                                                        <Form.Input onChange={this.toggleSkill} name={skill} key={i} type="checkbox" label={skill} value={skill} checked={skills.includes(skill)} />)}
                                                </Form.Group>
                                            </Form>
                                        </Segment>
                                    </Segment.Group>
                                </Grid.Column>
                            </Grid.Row>
                        )}
                        <Grid.Row textAlign="center">
                            <Grid.Column>
                                <LogoutButton />
                            </Grid.Column>
                        </Grid.Row>
                    </Responsive>
                ) : <p></p>}
            </div>
        )
    }
}