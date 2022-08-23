import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import "../styles/message_form.css";
import { AppContext } from "../context/AppContext"

function MessageForm() {
    const [message, setMessage] = useState("");
    const user = useSelector((state) => state.user);
    const { socket, currentRoom, setMessages, messages, privateMemberMsg } = useContext(AppContext);
    const messageEndRef = useRef()

    const scrollIntoView = () => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollIntoView()
    }, [messages])

    const dateFormatter = () => {
        const date = new Date();
        const year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();
        let day = date.getDate().toString();

        month = month.length > 1 ? month : "0" + month
        day = day.length > 1 ? day : "0" + day;

        return month + "/" + day + "/" + year;
    }
    const submitHandler = async (event) => {
        event.preventDefault();
        if (!message) return;
        const today = new Date();
        const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
        const time = today.getHours() + ":" + minutes;
        const roomId = currentRoom;
        socket.emit("message-room", roomId, message, user, time, dateFormatter())
        setMessage("")
    }

    socket.off("room-messages").on("room-messages", (roomMessages) => {
        console.log(roomMessages)
        setMessages(roomMessages)
    })
    return (
        <>
            {user && !privateMemberMsg && <div className='room-name-header'><p className='name' style={{marginLeft: 10}}>{currentRoom}</p></div>}
            {user && privateMemberMsg &&
                <div className='room-name-header'>
                    <img src={privateMemberMsg?.picture} alt="profile" />
                    <div className="name-status">
                        <span className='name'>{privateMemberMsg?.name}</span>
                        <span className="status">{privateMemberMsg?.status}</span>
                    </div>
                </div>}
            <div className="message-output">
                {!user && <div className='alert alert-danger'>Please Login</div>}
                {user && messages.map(({ _id: date, messagesByDate }, index) => (
                    <div key={index}>
                        <p className='text-center message-date-indicator'>{date}</p>
                        {messagesByDate?.map(({ content, time, from: sender }, ind) => (
                            <div className={sender?.email === user?.email ? "sender-message" : "incomming-message"} key={ind}>
                                <div className="message-inner">
                                    <div className="d-flex align-items-center">
                                        {!privateMemberMsg && sender._id !== user?._id && (
                                            <>
                                                <img src={sender.picture} style={{ width: 20, height: 20, objectFit: "cover", borderRadius: "50%", marginRight: 10 }} alt="sender" />
                                                <p className="message-sender">{sender._id === user?._id ? "You" : sender.name}</p>
                                            </>)}
                                    </div>
                                    <p className="message-content">{content}</p>
                                    <p className="message-timestamp">{time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <div ref={messageEndRef}></div>
            </div>
            <Form onSubmit={submitHandler}>
                <Row>
                    <Col md={10}>
                        <Form.Group>
                            <Form.Control type='text' placeholder='Enter message' disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col md={2}>
                        <Button variant='primary' type='submit' disabled={!user} style={{ width: "100%", backgroundColor: "orange" }}><i className='fas fa-paper-plane'></i></Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default MessageForm