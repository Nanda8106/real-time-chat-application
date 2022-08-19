import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import "../styles/message_form.css";

function MessageForm() {
    const submitHandler = async (event) => {
        event.preventDefault();
    }
    return (
        <>
            <div className="message-output"></div>
            <Form onSubmit={submitHandler}>
                <Row>
                    <Col md={11}>
                        <Form.Group>
                            <Form.Control type='text' placeholder='Enter message' />
                        </Form.Group>
                    </Col>
                    <Col md={1}>
                        <Button variant='primary' type='submit' style={{ width: "100%", backgroundColor: "orange" }}><i className='fas fa-paper-plane'></i></Button>
                    </Col>
                </Row>
            </Form>s
        </>
    )
}

export default MessageForm