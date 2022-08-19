import React from 'react';
import { ListGroup} from 'react-bootstrap';

function SideBar() {
    const rooms = ["First room", "Second room", "Third room"]
  return (
    <>
        <h2>Available rooms</h2>
        <ListGroup>
            {rooms.map( (room, index) => (
                <ListGroup.Item key={index}>{room}</ListGroup.Item>
            ))}
        </ListGroup>
    </>
  )
}

export default SideBar