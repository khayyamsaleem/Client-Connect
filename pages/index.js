import Link from 'next/link'
import { Grid, Header, Image, Button } from 'semantic-ui-react'
import Logo from '~/assets/ClientConnectLogo.svg'
import App from '~/containers/App'

export default () => (
    <App>
        <div className="landing-page">
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='blue' textAlign='center'>
                        <Image src={Logo} style={{width: '100%'}} />
                        <Link href='/login'>
                            <Button color="blue" fluid size='large'>
                                Login
                            </Button>
                        </Link>
                        <div style={{height: '10px'}}></div>
                        <Link href='/register'>
                            <Button color="blue" fluid size='large'>
                                Register
                            </Button>
                        </Link>
                    </Header>
                </Grid.Column>
            </Grid>
        </div>
    </App>
)

