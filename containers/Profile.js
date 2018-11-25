import React, { Component } from 'react'
import LogoutButton from '~/components/LogoutButton'
import { Grid } from 'semantic-ui-react'
import '~/styles/App.scss'

export default class extends Component{
    render(){
        return (
            <div className="profile-page">
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign="middle">
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <LogoutButton />
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}