import React, { Component } from 'react'
import LogoutButton from '~/components/LogoutButton'
import { Grid, Header, Segment, Label, Responsive, Form, Button } from 'semantic-ui-react'
import '~/styles/App.scss'
import { getCurrentUser, updateSkills } from '~/utils/api/users'
import { getProjectsByUser } from '~/utils/api/projects'
import Router from 'next/router'
import AddProject from '~/components/AddProject'
import allSkills from '~/utils/skills'
import LiveChat from '~/components/chat'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: {},
            projects: [],
            isLoading: true,
            skills: []
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
                skills: userObj.currentUser.skills
            })
        }
    }

    updateSkills = async (e) => {
        e.preventDefault()
        const { skills, currentUser } = this.state
        const result = await updateSkills(currentUser._id, skills)
        console.log(result)
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
    }

    render() {
        const { projects, currentUser, skills } = this.state
        return (
            <div className="profile-page">
                {(!this.state.isLoading) ? (
                    <Responsive as={Grid} verticalAlign="middle" style={{ width: '60%', height: '60%' }} id="profileGrid" padded>
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
                                                        <Form.Input onChange={this.toggleSkill} name={skill} key={i} type="checkbox" label={skill} value={skill} checked={currentUser.skills.includes(skill) || skills.includes(skill)} />)}
                                                </Form.Group>
                                                <Form.Group inline>
                                                    {allSkills.slice(Math.floor(allSkills.length / 3), Math.floor(allSkills.length / 3) * 2).map((skill, i) =>
                                                        <Form.Input onChange={this.toggleSkill} name={skill} key={i} type="checkbox" label={skill} value={skill} checked={currentUser.skills.includes(skill) || skills.includes(skill)} />)}
                                                </Form.Group>
                                                <Form.Group inline>
                                                    {allSkills.slice(Math.floor(allSkills.length / 3) * 2, allSkills.length).map((skill, i) =>
                                                        <Form.Input onChange={this.toggleSkill} name={skill} key={i} type="checkbox" label={skill} value={skill} checked={currentUser.skills.includes(skill) || skills.includes(skill)} />)}
                                                </Form.Group>
                                            </Form>
                                        </Segment>
                                        <Segment textAlign="center">
                                            <Button onClick={this.updateSkills} type="submit">Update Skills</Button>
                                        </Segment>
                                    </Segment.Group>
                                </Grid.Column>
                            </Grid.Row>
                        )}
                        <Grid.Row>
                            <Grid.Column width={16} style={{ top: 20 }}>
                                <Segment.Group id="forceSameSegmentHeight">
                                    <Segment><Header as='h3'> Start Chatting</Header></Segment>
                                    <Segment.Group>
                                        <Segment>
                                            <LiveChat currentuser={currentUser}/>
                                        </Segment>
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
                ) : <p></p>}
            </div>
        )
    }
}