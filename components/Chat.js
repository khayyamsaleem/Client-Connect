import React, { Component } from 'react'
import io from "socket.io-client"
import { Grid, Form, Segment, Button, Message } from 'semantic-ui-react'

import { getMessageHistory, getActiveUsers, sendMessageAndUser, leaveRoom } from '~/utils/api/chat'
import getRootUrl from '~/utils/getRootUrl'

export default class Chat extends Component {

    // concat state data to array

    constructor(props) {
        super(props);
        //state created when user submits message form
        this.state = {
            message: '',
            messages: [],
            activeUsers: [],
            err: { exists: false, header: '', msg: '' }
        };
    }

    componentDidMount = async () => {
        this.socket = io();
        // after socket SEND_MESSAGE data recieved from server, RECIEVE_MESSAGE is called
        // adds sent message's current state to the messages array

        const { messages } = await getMessageHistory()
        this.setState({
            messages: messages
                                .map(o => JSON.parse(o))
                                .filter(
                                    m => m.user === this.props.currentuser.userName || m.user === this.props.recipient.userName
                                )
        })
        const { users } = await getActiveUsers()
        this.setState({ activeUsers: users })
        this.socket.on('message', data => {
            console.log("RECEIVED MESSAGE: ", data)
            if (data.user !== 'system') {
                this.setState({
                    messages: [...this.state.messages, data]
                })
            }
        })
        this.socket.on('users', data => {
            console.log("SOCKET RECEIVED DATA (users)", users)
            this.setState({activeUsers: data})
        })
    }

    componentWillUnmount = async () => {
        const result = await leaveRoom(this.props.currentuser.userName)
    }

    // send a message from user form to server
    sendMessage = async ev => {
        ev.preventDefault()
        const { message } = this.state
        const timestamp = Date.now()
        const user = this.props.currentuser.userName
        const payload = {
            message,
            user,
            timestamp
        }
        this.socket.emit('message', payload)
        const response = await sendMessageAndUser(payload)
        this.setState({
            messages: [...this.state.messages, payload]
        })
        this.setState({message: ''})
    };

    // calls sendMessage when form is sumbitted, updates state with value entered
    // div 'messages' loops through the state's messages array and prints the to our page
    render() {
        const { messages, err, message } = this.state
        return (
            <div className="chat-form">
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign="middle">
                    <Grid.Row>
                        <div className='messages'>
                            {messages.map((m, i) => {
                                return (
                                    <div key={i} style={{ 
                                        color: (m.user === this.props.currentuser.userName) ? 'green' : (m.user === 'system') ? 'red': 'blue' }}>{m.user}: {m.message}</div>
                                )
                            })}
                        </div>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column style={{ maxWidth: 450 }}>

                            <Form size='large' error={err.exists} onSubmit={this.sendMessage}>
                                <Segment stacked>
                                    <Form.Input name='message' placeholder="Message..."
                                        value={message}
                                        onChange={ev => this.setState({ message: ev.target.value })}
                                    />
                                    <Button type="submit" color="blue" fluid size='large' content="chat" />
                                    <Message error header={err.header} content={err.msg} />
                                </Segment>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}
