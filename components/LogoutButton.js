import { Button, Segment } from 'semantic-ui-react'
import Router from 'next/router'
import { getFromStorage } from '~/utils/storage'
import { logoutUser } from '~/utils/api/users'

export default () => (
    <Segment>
        <Button onClick={async ()=> {
            const obj = getFromStorage('clientconnect')
            if (obj && obj.token){
                const { token } = obj
                const res = await logoutUser(token)
                if (res.success) {
                    Router.push('/')
                }
            }
        }} content="Logout" size="large"/>
    </Segment>
)