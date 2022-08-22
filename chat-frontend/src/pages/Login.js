import React, { useContext, useState } from 'react'
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/login.css";
import { useSignInUserMutation } from '../services/ApiHelper';
import { AppContext } from '../context/AppContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userSignIn, {loading, error}] = useSignInUserMutation();
  const {socket} = useContext(AppContext)
  const navigate = useNavigate();

  const loginHandler = async (event) => {
    event.preventDefault();
    userSignIn({email, password}).then( ({data}) => {
      if(data){
        //send new user to backend to connect to all the rooms by using socket
        socket.emit("new-user")
        navigate("/chat")
      }
    })
  }
  return (
    <Container>
      <Row>
        <Col md={5} className="login__bg"></Col>
        <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={loginHandler}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter email" required />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" required />
            </Form.Group>
            <Button variant="primary" type="submit">Login</Button>
            <div className="py-4">
              <p className="text-center">
                Don't have an account: <Link to="/signup">Signup</Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login;