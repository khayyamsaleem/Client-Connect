import React, { Component } from 'react'
import { Button, Header, Modal, Form, Icon, Segment, Grid, Message} from 'semantic-ui-react'
import { addProject } from '~/utils/api/projects'
import skills from '~/utils/skills'

export default class AddProject extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: "",
            description: "",
            skills: [],
            modalOpen: false,
            err: {exists: false, header: '', msg: ''}
        }
    }
    handleOpen = () => this.setState({ modalOpen: true })
    handleClose = () => this.setState({ modalOpen: false })

    handleSubmit = (e) => {
        e.preventDefault()
        const { title, description, skills } = this.state
        const currentUser = this.props.currentuser
        addProject({title, description, skills, currentUser})
        this.setState({modalOpen: false})
    }
    handleChange = (e, {name, value}) => {
        if (name === "requirements"){
            this.setState({
                requirements: e.target.files[0]
            })
        } else {
            this.setState({
                [name]: value.trim(),
                err: {
                    exists: false,
                    header: '',
                    msg: ''
                }
            })
        }
    }
    toggleSkill = (e, {name, value}) => {
        let skills = this.state.skills
        if (skills.includes(value)){
            skills = skills.filter(s => s!==value)
            this.setState({skills})
        } else {
            skills.push(value)
            this.setState({skills})
        }
    }
    render() {
        const { err } = this.state
        return (
            <Segment.Group>
                <Segment textAlign="center">
                    <Modal centered={false} trigger={<Icon onClick={this.handleOpen} name="plus square outline" size="huge"/>} open={this.state.modalOpen} onClose={this.handleClose}>
                        <Grid>
                            <Grid.Column style={{ maxWidth: 750, padding: 50 }}>
                                <Header as="h1">Add a Project</Header>
                                <Form onSubmit={this.handleSubmit} error={err.exists}>
                                    <Form.Group >
                                        <Form.Input label="Project Title" placeholder="Project Title" name="title" width={16} required onChange={this.handleChange} />
                                    </Form.Group>
                                    <Form.Group widths="equal">
                                        <Form.TextArea label="Project Description" placeholder="Enter a description" name="description" required onChange={this.handleChange} />
                                    </Form.Group>
                                    {/* <Form.Input label="Requirements" name="requirements" type="file" accept=".pdf" onChange={this.handleChange} required /> */}
                                    <Header as="h4">Required Skills</Header>
                                    <Form.Group inline>
                                        {skills.slice(0,Math.floor(skills.length / 2)).map((skill, i) =>
                                        <Form.Input onChange={this.toggleSkill} name={skill} key={i} type="checkbox" label={skill} value={skill}/>)}
                                    </Form.Group>
                                    <Form.Group inline>
                                        {skills.slice(Math.floor(skills.length / 2), skills.length).map((skill, i) => 
                                        <Form.Input onChange={this.toggleSkill} name={skill} key={i} type="checkbox" label={skill} value={skill}/>)}
                                    </Form.Group>
                                    <Message error header={err.header} content={err.msg} />
                                    <Button type='submit'>Add Project</Button>
                                </Form>
                            </Grid.Column>
                        </Grid>
                    </Modal>
                </Segment>
                <Segment textAlign="center">Add a New Project!</Segment>
            </Segment.Group>
        )
    }
}