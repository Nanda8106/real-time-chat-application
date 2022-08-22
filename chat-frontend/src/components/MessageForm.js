import React, { useContext, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import "../styles/message_form.css";
import {AppContext} from "../context/AppContext"

function MessageForm() {
    const [message, setMessage] = useState("");
    const user = useSelector( (state) => state.user);
    const {socket, currentRoom, setMessages, messages} = useContext(AppContext);

    const dateFormatter = () => {
        const date = new Date();
        const year = date.getFullYear();
        let month = (1+date.getMonth()).toString();
        let day = date.getDate().toString();

        month = month.length > 1 ? month : "0" + month
        day = day.length > 1 ? day : "0" + day;

        return month + "/" + day + "/" + year;
    }
    const submitHandler = async (event) => {
        event.preventDefault();
        if(!message) return;
        const today = new Date();
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const time = today.getHours + ":" + minutes;
        const roomId = currentRoom;
        socket.emit("message-room", roomId, message, user, time, dateFormatter())
        setMessage("")
    }

    socket.off("room-messages").on("room-messages", (roomMessages) => {
        console.log(roomMessages)
        setMessages(roomMessages[0]["messagesByDate"])
    })
    return (
        <>
            <div className="message-output">
                {!user ? <div className='alert alert-danger'>Please Login</div> : (
                    <>{messages.map( (eachMessage, index) => (
                        <div className="each-message" key={index}>{eachMessage.content}</div>
                    ))}</>
                )}
            </div>
            <Form onSubmit={submitHandler}>
                <Row>
                    <Col md={11}>
                        <Form.Group>
                            <Form.Control type='text' placeholder='Enter message' disabled={!user} value = {message} onChange = {(e) => setMessage(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md={1}>
                        <Button variant='primary' type='submit' disabled={!user} style={{ width: "100%", backgroundColor: "orange" }}><i className='fas fa-paper-plane'></i></Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default MessageForm