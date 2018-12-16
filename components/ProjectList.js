import React, { Component } from 'react'
import { Grid, Modal, Segment, Header } from 'semantic-ui-react'
import { getProjectsByUser } from '~/utils/api/projects'
import { getCurrentUser } from '~/utils/api/users'

export default class ProjectList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            projects: [],
            modalOpen: false
        }
    }
    componentDidMount = async () => {
        const currentUserObj = await getCurrentUser()
        const currentUser = currentUserObj.currentUser
        const projectsObj = await getProjectsByUser(currentUser._id)
        const projects = projectsObj.projects
        this.setState({ projects })
    }
    handleOpen = () => this.setState({ modalOpen: true })
    handleClose = () => this.setState({ modalOpen: false })
    render() {
        const { projects } = this.state
        return (
            <Grid.Row>
                <Grid.Column width={16}>
                    <Segment onClick={this.handleOpen} textAlign="center"><Header as="h3" content="Click here to select a project!" /></Segment>
                    <Modal open={this.state.modalOpen} onClose={this.handleClose}>
                        <Grid verticalAlign="middle">
                            <Grid.Row>
                                <Grid.Column>
                                    <Segment.Group>
                                        {(projects.length > 0) ? projects.map((project, i) => 
                                            <Segment key={i} onClick={() => this.props.handleSelect(project) && this.handleClose()}>
                                                <Header as="h5" content={project.title} />
                                                {project.description}
                                            </Segment>
                                        ) : <Segment><Header as="h3" content="No Projects Created Yet!" />Head over to your profile to create one!</Segment>}
                                    </Segment.Group>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal>
                </Grid.Column>
            </Grid.Row>
        )
    }
}