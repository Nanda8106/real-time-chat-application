import React from 'react'
import { Nav, Navbar, Container, NavDropdown, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { LinkContainer } from "react-router-bootstrap"
import logo from "../assets/logo.jpg"
import {useSignOutUserMutation} from "../services/ApiHelper"

const Navigation = () => {
    const user = useSelector((state) => state.user);
    const [signoutUser] = useSignOutUserMutation();
    const logoutHandler = async (event) => {
        event.preventDefault();
        await signoutUser(user);

        window.location.replace("/")
    }
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>
                        <img src={logo} style={{ width: 100, height: 50 }} alt="" />
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <LinkContainer to="/chat">
                            <Nav.Link>Chat</Nav.Link>
                        </LinkContainer>
                        {!user && (
                            <>
                                <LinkContainer to="/login">
                                    <Nav.Link>Login</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/signup">
                                    <Nav.Link>Signup</Nav.Link>
                                </LinkContainer>
                            </>
                        )}

                        {user && (
                            <NavDropdown title={
                                <>
                                    <img src={user.picture} alt="user" style={{width: 30, height: 30, marginRight: 5, marginLeft: 10,  objectFit: "cover", borderRadius: "50%"}} />
                                    {user.name}
                                </>
                            } id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item>
                                    <Button variant='danger' onClick={logoutHandler}>Logout</Button>
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation;
