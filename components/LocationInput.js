import React, { Component } from 'react'
import { Dropdown, Button, Segment } from 'semantic-ui-react';
import nominatim from 'nominatim-geocoder';
import { updateUser } from '~/utils/api/users'

const geocoder = new nominatim()
const WAIT_INTERVAL = 1000

export default class extends Component {
    constructor(props){
        super(props)
        this.state = {
            options: [],
            optionsVerbose: [],
            inputValue: []
        }
    }

    componentWillMount() {
        this.timer = null
    }

    async handleInputChange(e) {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.geocodeInput.bind(this), WAIT_INTERVAL)
        this.setState({ inputValue: e.target.value })
    }
    async handleSubmit(e) {
        let updatedUser = this.props.getUser()

        await updateUser(updatedUser.userName, "location", this.state.inputValue)

        updatedUser.location = this.state.inputValue
        await this.geocodeInput(this.state.inputValue)
        this.props.setUser(updatedUser)
    }
    
    handleKeyDown(e) {
        if (e.keyCode == 13) {
            geocodeInput()
        }
    }

    async geocodeInput() {
        const inp = this.state.inputValue;

        try {
            const loc = await new Promise((res, rej) => {
                geocoder.search( { q: inp } )
                    .then((response) => {
                        res(response)
                    })
                    .catch((error) => {
                        rej(error)
                    })
            })

            let inc = 0
            this.setState({
                options: loc.map(v => ({key: inc++, value: inc, text: v.display_name})),
                optionsVerbose: loc
            })
        } catch (e) {
            this.setState({options: []})
        }
    }

    render() {
        return <Segment>
            <Dropdown 
                onSearchChange={this.handleInputChange.bind(this)} 
                onKeyDown={this.handleKeyDown.bind(this)}
                placeholder='Select Country' 
                fluid search selection 
                options={this.state.options} />
            <Button content="Submit" onClick={this.handleSubmit.bind(this)}/>
        </Segment>
    }
}