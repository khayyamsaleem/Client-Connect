import React, { Component } from 'react'
import { checkExists } from '~/utils/api/users'
import io from "socket.io-client"
import { Grid, Form, Segment, Button, Message } from 'semantic-ui-react'
import getRootUrl from '~/utils/getRootUrl'

export default class Chat extends Component {

    // concat state data to array

    constructor(props) {
        super(props);
        //state created when user submits message form
        this.state = {
            message: '',
            messages: [],
            err: { exists: false, header: '', msg: '' },
            timeLog: new Date().toLocaleString(),
            rooms: []
        };
    }

    componentDidMount = async () => {
        this.socket = io(getRootUrl());
        // after socket SEND_MESSAGE data recieved from server, RECIEVE_MESSAGE is called
        // adds sent message's current state to the messages array
        const addMessage = data => {
            this.setState({ messages: [...this.state.messages, data] })
        }
        this.socket.on('RECEIVE_MESSAGE', function (data) {
            addMessage(data)
        })
    }

    // send a message from user form to server
    sendMessage = async ev => {
        ev.preventDefault()
        const { message, timeLog } = this.state
        const userExists = await checkExists(this.props.currentuser.userName)

        // check if username exists 
        if (userExists.exists === false) {
            this.setState({ err: { exists: true, header: "No Such User!", msg: "Ensure your username is typed correctly" } })
            return
        }

        if (this.state.message === '') {
            this.setState({ err: { exists: true, header: "Please Provide a Message!", msg: "" } })
            return
        }
        else {
            this.setState({ err: { exists: false, header: "", msg: "" } })
        }

        // socket emits message 
        this.socket.emit('SEND_MESSAGE', {
            to: this.props.recipient.userName,
            from: this.props.currentuser.userName,
            message,
            timeLog
        });

        // clear message sent from state
        this.setState({ message: '' });
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
                                    <div key={i} style={{ color: (m.from === this.props.currentuser.userName) ? 'green' : 'blue' }}>{m.from}: {m.message}</div>
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
