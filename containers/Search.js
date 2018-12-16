import React, { Component } from 'react'
import { Grid, Segment, Label, Button} from 'semantic-ui-react'
import ProjectList from '~/components/ProjectList'
import { getCurrentUser, getFreelancersBySkills } from '~/utils/api/users'
import { assignFreelancerToProject } from '~/utils/api/projects'
import Router from 'next/router'
import { haversineDistance } from '~/utils/haversine.js';

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
        const { currentUser } = this.state

        if (currentUser.hasOwnProperty("location") && currentUser.location) {
            const { lat: lat1, lon: lon1 } = this.state.currentUser.location;

            for (let candidate of candidates) {
                if (!candidate.hasOwnProperty("location")) {
                    candidate.distance = -1
                    continue
                }
                const { lat: lat2, lon: lon2 } = candidate.location

                candidate.distance = haversineDistance(lat1, lon1, lat2, lon2)
            }

            candidates.sort((a, b) => {
                if (b.distance == -1) return -1
                if (a.distance == -1) return 1
                else return a.distance - b.distance
            });
        }

        this.setState({candidates})
    }
    selectFreelancer = async (selectedFreelancer) => {
        const { selectedProject } = this.state
        const result = await assignFreelancerToProject(selectedFreelancer._id, selectedProject._id)
        Router.push('/profile')
    }
    render(){
        const { candidates, currentUser } = this.state
        
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
                                        {currentUser.hasOwnProperty("location") && currentUser.location ?
                                            <Segment>
                                                <Label horizontal>Distance</Label>
                                                {boi.distance === -1 ? "No location specified" : (`${boi.distance.toFixed(2)}km`)}
                                            </Segment>
                                            : <div></div>}
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