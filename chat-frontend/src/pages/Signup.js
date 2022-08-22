import React, { useState } from 'react'
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/signup.css";
import bot from "../assets/bot.png";
import { useSignUpUserMutation } from '../services/ApiHelper';


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signupUser, { isLoading, error }] = useSignUpUserMutation()
  const navigate = useNavigate();
  //image
  const [image, setImage] = useState(null);
  const [uploadImage, setUploadImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const validateImg = event => {
    const file = event.target.files[0];
    if (file.size >= 5242880) {
      alert("Max file size is 5mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const uploadingImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "idcjgz4d");
    try {
      setUploadImage(true);
      let result = await fetch('https://api.cloudinary.com/v1_1/dkzvjbzgw/image/upload', {
        method: 'POST',
        body: data
      })
      const urlData = await result.json();
      setUploadImage(false)
      return urlData.url
    } catch (error) {
      setUploadImage(false)
      console.log(error)
    }
  }

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!image) {
      return alert("Please upload profile picture!")
    } else {
      const url = await uploadingImage(image);
      console.log(url)
      signupUser({ name, email, password, picture: url }).then(({ data }) => {
        if (data) {
          console.log(data)
          navigate("/chat")
        }
      })

    }
  }
  return (
    <Container>
      <Row>
        <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
            <h1 className="text-center">Create Account</h1>
            <div className="signup-profile-pic__container">
              <img src={imagePreview || bot} alt="" className="signup-profile-pic" />
              <label htmlFor="image-upload" className='image-upload-label'>
                <i className="fas fa-plus-circle add-picture-icon"></i>
                <input type="file" id='image-upload' hidden accept='image/png image/jpg' onChange={validateImg} />
              </label>
            </div>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Name" required />
            </Form.Group>
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
            <Button variant="primary" type="submit">{uploadImage ? "Signing you up..." : "Signup"}</Button>
            <div className="py-4">
              <p className="text-center">
                Already have an account: <Link to="/login">Login</Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={5} className="signup__bg"></Col>
      </Row>
    </Container>
  )
}

export default Signup;
