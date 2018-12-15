import React, { Component } from 'react'
import Router from 'next/router'
import { getFromStorage } from '~/utils/storage'
import { checkExists } from '~/utils/api/users'
import io from "socket.io-client";
import { Grid, Form, Segment, Button, Header, Image, Message } from 'semantic-ui-react'

export default class Login extends Component {
    
    constructor(props){
        super(props);
        //state created when user submits message form
        this.state = {
            to: '',
            from: '',
            message: '',
            messages: [],
            err: { exists: false, header: '', msg: '' },
            //isLoading: false,
            //getFromStorage('clientconnect')
            timeLog: new Date().toLocaleString(),
            rooms: []
        
        };

        this.socket = io('localhost:5000');
        
        // after socket SEND_MESSAGE data recieved from server, RECIEVE_MESSAGE is called
        // adds sent message's current state to the messages array
        this.socket.on('RECIEVE_MESSAGE', function(data){
            console.log('recieve check')
            console.log(data)
            console.log(getFromStorage('clientconnect'))
            console.log('token check')
            addMessage(data)
        })
        
        // concat state data to array
        const addMessage = data => {
            this.setState({messages: [...this.state.messages, data]})
            console.log(this.state.messages)
            console.log('hist chec')
        }
        
    
        // send a message from user form to server
        this.sendMessage = async ev => {
            ev.preventDefault()
            const { from } = this.state
            const userExists = await checkExists(from)

            // check if username exists 
            if (userExists.exists === false) {
                this.setState({ err: { exists: false, header: "No Such User!", msg: "Ensure your username is typed correctly" } })
                return
            }
            this.setState({err: {exists: true, header: "", msg: ""}})
            
            // socket emits message 
            this.socket.emit('SEND_MESSAGE', {
                to: this.state.to,
                from: this.state.from,
                message: this.state.message,
                timeLog: this.state.timeLog
            });
            
            // clear message sent from state
            this.setState({ message: '' });
        };
    }
    
    /*
    componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));
    }
    */
    
    // calls sendMessage when form is sumbitted, updates state with value entered
    // div 'messages' loops through the state's messages array and prints the to our page
    render() {
        const state = this.state
        return (
            <div className="chat-form">
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign="middle">
                    <Grid.Row>
                        <div className='messages'>
                            {this.state.messages.map(message => {
                                return (
                                    <div>{message.from}: {message.message}</div>
                                )
                            })}
                        </div>
                    </Grid.Row>
                    <Grid.Row>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        
                        <Form size='large' error={state.err.exists} onSubmit={this.sendMessage}>
                            <Segment stacked>
                                <Form.Input name='to' placeholder="Reciever: Freelancer.Username" 
                                value={this.state.to}
                                onChange={ev => this.setState({ to: ev.target.value })}  />
                                <Form.Input name='from' placeholder="Sender: Your.Username"
                                value={this.state.from}
                                onChange={ev => this.setState({ from: ev.target.value })} />
                                <Form.Input name='message' placeholder="Message..."
                                value={this.state.message}
                                onChange={ev => this.setState({ message: ev.target.value })}
                                 />
                                <Button type="submit" color="blue" fluid size='large' content="chat"/>
                                <Message error header={state.err.header} content={state.err.msg} />
                            </Segment>
                        </Form>
                    </Grid.Column>
                    </Grid.Row>
                    
                </Grid>
            </div>
        );
    }
}
