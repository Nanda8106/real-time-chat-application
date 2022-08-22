import React, { useContext, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { AppContext } from '../context/AppContext';

function SideBar() {
  // const rooms1 = ["First room", "Second room", "Third room"]
  const { socket, rooms, setRooms, currentRoom, setCurrentRoom, members, setMembers, messages, setMessages, privateMemberMsg, setPrivateMemberMsg, newMessages, setNewMessages } = useContext(AppContext)
  const user = useSelector((state) => state.user);

  const getRooms = () => {
    fetch("http://localhost:4000/api/v1/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
  }
  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload)
  })

  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms()
      socket.emit("join-room", "general")
      socket.emit("new-user")
    }
  }, [])
  if (!user) {
    return <></>
  }
  return (
    <>
      <h2>Available rooms</h2>
      <ListGroup>
        {rooms.map((room, index) => (
          <ListGroup.Item key={index}>{room}</ListGroup.Item>
        ))}
      </ListGroup>
      <h2>Members</h2>
      <ListGroup>
        {members.map((member) => (

          <ListGroup.Item key={member.id} style={{ cursor: "pointer" }}>{member.name}</ListGroup.Item>
        ))}
      </ListGroup>
    </>
  )
}

export default SideBar