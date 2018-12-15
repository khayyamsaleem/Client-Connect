import React, { Component } from 'react'
import { checkExists } from '~/utils/api/users'
import io from "socket.io-client";
import { Grid, Form, Segment, Button, Message } from 'semantic-ui-react'
import getRootUrl from '~/utils/getRootUrl'

export default class Login extends Component {

    constructor(props) {
        super(props);
        //state created when user submits message form
        this.state = {
            to: '',
            from: props.currentuser.userName,
            message: '',
            messages: [],
            err: { exists: false, header: '', msg: '' },

            //isLoading: false,
            //getFromStorage('clientconnect')
            timeLog: new Date().toLocaleString(),
            rooms: []

        };

        this.socket = io(getRootUrl());

        // after socket SEND_MESSAGE data recieved from server, RECIEVE_MESSAGE is called
        // adds sent message's current state to the messages array
        this.socket.on('RECIEVE_MESSAGE', function (data) {
            console.log('recieve check')
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
            const { to } = this.state
            const userExists = await checkExists(to)

            // check if username exists 
            if (userExists.exists === false) {
                this.setState({ err: { exists: false, header: "No Such User!", msg: "Ensure your username is typed correctly" } })
                return
            }

            if ( this.state.message == '' ) {
                this.setState({ err: { exists: false, header: "Please Provide a Message!", msg: "" } })
                return
            }
            else{
                this.setState({ err: { exists: true, header: "", msg: "" } })
            }

            // socket emits message 
            this.socket.emit('SEND_MESSAGE', {
                to: this.state.to,
                from: this.state.from,
                message: this.state.message,
                timeLog: this.state.timeLog
                //messages: this.state.messages
            });

            /*
            this.socket.on('MESSAGE_HISTORY', {
                messages: this.state.messages
            })
            */

            // clear message sent from state
            this.setState({ message: '' });
        };
    }

    // calls sendMessage when form is sumbitted, updates state with value entered
    // div 'messages' loops through the state's messages array and prints the to our page
    render() {
        const { messages, err, to, from, message } = this.state
        return (
            <div className="chat-form">
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign="middle">
                    <Grid.Row>
                        <div className='messages'>
                            {messages.map((m, i) => {
                                return (
                                    <div style={{ color: (i % 2 == 0) ? 'green' : 'blue' }}>{m.from}: {m.message}</div>
                                )
                            })}
                        </div>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column style={{ maxWidth: 450 }}>

                            <Form size='large' error={err.exists} onSubmit={this.sendMessage}>
                                <Segment stacked>
                                    <Form.Input name='to' placeholder="Reciever: Freelancer's Username"
                                        value={to}
                                        onChange={ev => this.setState({ to: ev.target.value })} />
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
