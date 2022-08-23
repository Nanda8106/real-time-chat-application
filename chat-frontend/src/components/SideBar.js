import React, { useContext, useEffect } from 'react';
import { Col, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../context/AppContext';
import { addNotifications, resetNotifications } from '../features/userSlice';
import "../styles/sidebar.css"


function SideBar() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const { 
    socket,
    rooms,
    setRooms, 
    currentRoom, 
    setCurrentRoom,
    members,
    setMembers,
    privateMemberMsg,
    setPrivateMemberMsg
  } = useContext(AppContext)

  const getRooms = () => {
    fetch("http://localhost:4000/api/v1/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
  }
  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload)
  })

  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom !== room) {
      dispatch(addNotifications(room))
    }
  })

  useEffect(() => {
    if (user) {
      setCurrentRoom("general");
      getRooms()
      socket.emit("join-room", "", "general")
      socket.emit("new-user")
    }
  }, [])

  const orderIds = (id1, id2) => {
    if (id1 > id2) {
      return id1 + "-" + id2
    } else {
      return id2 + "-" + id1
    }
  }

  const joinRoom = (room, isPublic = true) => {
    if (!user) {
      return alert("Please login!");
    }
    socket.emit("join-room", currentRoom, room);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMsg(null)
    }

    dispatch(resetNotifications(room))
  }

  const handlePrivateMessage = (member) => {
    setPrivateMemberMsg(member)
    const roomId = orderIds(user._id, member._id)
    joinRoom(roomId, false);
  }

  if (!user) {
    return <></>
  }
  return (
    <>
      <h2>Available rooms</h2>
      <ListGroup>
        {rooms.map((room, index) => (
          <ListGroup.Item key={index} onClick={() => joinRoom(room)} className={`${room === currentRoom ? "room-active" : ""}`} style={{ cursor: "pointer", textTransform: "capitalize", display: "flex", justifyContent: "space-between" }}>
            {room}
            {currentRoom !== room && <span className='badge rounded-pill bg-primary'>{user.newMessages[room]}</span>}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h2>Members</h2>
      <ListGroup>
        {members.map((member) => (
          <ListGroup.Item key={member.id} style={{ cursor: "pointer" }} disabled={member._id === user._id} className={`${privateMemberMsg?._id === member?._id ? "member-active" : ""}`} onClick={() => handlePrivateMessage(member)}>
            <Row>
              <Col xs={2} className="member-status">
                <img src={member.picture} alt={member.name} className="member-status-img" />
                {member.status === "online" ? <i className='fas fa-circle sidebar-online-status'></i> : <i className='fas fa-circle sidebar-offline-status'></i>}
              </Col>
              <Col xs={9}>
                {member.name}
                {member._id === user?._id && " (You)"}
                {member.status === "offline" && " (Offline)"}
              </Col>
              <Col xs={1}>
                <span className='badge rounded-pill bg-primary'>{user.newMessages[orderIds(user._id, member._id)]}</span>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  )
}

export default SideBar