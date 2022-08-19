import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import MessageForm from '../components/MessageForm';
import SideBar from '../components/SideBar';

const Chat = () => {
  return (
    <Container>
      <Row>
        <Col md={4}><SideBar/></Col>
        <Col md={8}><MessageForm/></Col>
      </Row>
    </Container>
  )
}

export default Chat;
