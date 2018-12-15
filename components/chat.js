import React, { Component } from 'react'
import { checkExists } from '~/utils/api/users'
import io from "socket.io-client";
import { Grid, Form, Segment, Button, Message } from 'semantic-ui-react'
import getRootUrl from '~/utils/getRootUrl'

export default class Chat extends Component {

    constructor(props) {
        super(props);
        //state created when user submits message form
        this.state = {
            to: props.recipient.userName,
            from: props.currentuser.userName,
            message: '',
            messages: [],
            err: { exists: false, header: '', msg: '' },
            timeLog: new Date().toLocaleString()

        };

        this.socket = io(getRootUrl());

        // after socket SEND_MESSAGE data recieved from server, RECIEVE_MESSAGE is called
        // adds sent message's current state to the messages array
        this.socket.on('RECIEVE_MESSAGE', function (data) {
            console.log('receive check')
            console.log(data)
            addMessage(data)
        })

        // concat state data to array
        const addMessage = data => {
            this.setState({ messages: [...this.state.messages, data] })
            console.log(this.state.messages)
            console.log('hist chec')
        }


        // send a message from user form to server
        this.sendMessage = async ev => {
            ev.preventDefault()
            const { to, from, message, timeLog } = this.state
            const userExists = await checkExists(from)

            // check if username exists 
            if (userExists.exists === false) {
                this.setState({ err: { exists: true, header: "No Such User!", msg: "Ensure your username is typed correctly" } })
                return
            }
            this.setState({ err: { exists: false, header: "", msg: "" } })

            // socket emits message 
            this.socket.emit('SEND_MESSAGE', {
                to,
                from,
                message,
                timeLog
            });

            // clear message sent from state
            this.setState({ message: '' });
        };
    }

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
                                    <div style={{ color: (m.from === this.state.from) ? 'green' : 'blue' }}>{m.from}: {m.message}</div>
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
