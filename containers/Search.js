import React, { Component } from 'react'
import { Grid, Segment, Label, Button} from 'semantic-ui-react'
import ProjectList from '~/components/ProjectList'
import { getCurrentUser, getFreelancersBySkills } from '~/utils/api/users'
import { assignFreelancerToProject } from '~/utils/api/projects'
import Router from 'next/router'

export default class Search extends Component{
    constructor(props){
        super(props)
        this.state = {
            currentUser: {},
            selectedProject: null,
            candidates: []
        }
    }
    componentDidMount = async () => {
        const currentUserObj = await getCurrentUser()
        const currentUser = currentUserObj.currentUser
        this.setState({
            currentUser
        })
    }
    selectProject = async (project) => {
        this.setState({selectedProject: project})
        const { candidates } = await getFreelancersBySkills(project.skills)
        this.setState({candidates})
    }
    selectFreelancer = async (selectedFreelancer) => {
        const { selectedProject } = this.state
        const result = await assignFreelancerToProject(selectedFreelancer._id, selectedProject._id)
        console.log(result)
        Router.push('/profile')
    }
    render(){
        const { candidates } = this.state
        return (
            <div className="search-page" style={{width: '60%'}} id="profileGrid">
                <Grid>
                    <ProjectList handleSelect={this.selectProject} />
                    <Grid.Row>
                        <Grid.Column width={16}>
                        <Segment.Group>
                            {candidates.map((boi, i) =>
                                    <Segment.Group key={i}>
                                        <Segment>
                                            <Label horizontal>Name</Label>
                                            {boi.firstName + ' ' + boi.lastName}
                                        </Segment>
                                        <Segment>
                                            <Label horizontal>Username</Label>
                                            {boi.userName}
                                        </Segment>
                                        <Segment>
                                            <Label horizontal>Join Date</Label>
                                            {new Date(boi.joinDate).toLocaleDateString('en-US')}
                                        </Segment>
                                        <Segment>
                                            <Label horizontal>Skills</Label>
                                            {boi.skills.join(", ")}
                                        </Segment>
                                        <Segment textAlign="center">
                                            <Button onClick={() => this.selectFreelancer(boi)}>Select this Freelancer</Button>
                                        </Segment>
                                    </Segment.Group>
                            )}
                        </Segment.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}