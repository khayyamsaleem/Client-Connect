import { updateUser } from '~/utils/api/users'
import Router from 'next/router'
import { Segment, Input, Button } from 'semantic-ui-react'

export default () => (
    <Segment>
        <Input value={this.state.locationValue} placeholder="Enter location..."/>
        <Button onClick={async ()=> {
            if (!this.state.locationValue) return

            await updateUser(this.props.user.userName, "location", this.state.locationValue)

            Router.post("/profile")
        }} content="Logout" size="large"/>
    </Segment>
)