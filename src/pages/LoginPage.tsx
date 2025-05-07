import React, { useState } from "react";
import authService from "../services/authService";
import { Button, Card, Col, Form, Image, Modal, Row } from "react-bootstrap";
import userService from "../services/userService";
import { User } from "../models/user";

export default function LoginPage() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });

  // const [errors, setErrors] = useState({
  //   username: "",
  //   email: "",
  //   firstName: "",
  //   lastName: "",
  //   password: "",
  //   confirmPassword: "",
  // });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegisterModalClose = () => setShowRegisterModal(false);
  const handleRegisterModalShow = () => setShowRegisterModal(true);
  
  const [createdUser, setCreatedUser] = useState();

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: User = {
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
      email: formData.email
    }
    
    userService.register(newUser).then(response => {
      setCreatedUser(response);
    });

    console.log('createdUser', createdUser);

    // form validation
    // const newErrors: any = {};
    // if (!formData.username) newErrors.username = "Username is required";
    // if (!formData.email) newErrors.email = "Email is required";
    // if (!formData.password) newErrors.password = "Password is required";
    // if (formData.password !== formData.confirmPassword) {
    //   newErrors.confirmPassword = "Passwords do not match";
    // }
    // setErrors(newErrors);

    // if (Object.keys(newErrors).length === 0) {
    //   console.log("Form submitted");
    //   // form logic processing
    // }
  };

  return (
    <>
      <div className="auth-page vh-100 d-flex align-items-center justify-content-center bg-light">
        <Card className="shadow-lg" style={{ borderRadius: "1rem", maxWidth: "800px", width: "100%" }}>
          
          <Row>
            {/* Image */}
            <Col className="col-md-5">
              <Image
                src="https://media.istockphoto.com/id/1277719288/photo/street-food-meat-cutlet-burgers-are-in-paper-boxes-food-delivery.jpg?s=612x612&w=0&k=20&c=DFjDsXpSuR_y82U-D8a1rvZi85bcVs7n9-bafyP3YWc="
                alt="Login visual"
                className="img-fluid h-100"
                style={{ borderRadius: "1rem 0 0 1rem", objectFit: "cover" }} />
            </Col>

            {/* Form */}
            <Col className="col-md-6 d-flex align-items-center">
              <Card.Body className="px-5 py-4 text-center">
                <h3 className="mb-4">Food Ordering System</h3>

                <Button variant="primary" size="lg" className="w-100 mb-3" onClick={authService.login}>
                  Sign In
                </Button>

                <Card.Text className="mb-3">— or —</Card.Text>

                <span className="mb-2">Don't have an account?</span>
                <Button variant="outline-success" size="lg" className="w-100" onClick={handleRegisterModalShow}>
                  Sign Up
                </Button>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Register Modal */}
      <Modal
        show={showRegisterModal}
        onHide={handleRegisterModalClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>New user registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleRegisterSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Username:</Form.Label>
              <Form.Control type="text" name="username" value={formData.username} onChange={handleInputChange} required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required/>
            </Form.Group> 
            <Form.Group> 
              <Form.Label>Fistname:</Form.Label>
              <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Lastname:</Form.Label>
              <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password:</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} required/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm password:</Form.Label>
              <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required/>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRegisterModalClose}>
            Close
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            // disabled={Object.keys(errors).length > 0}
          >
            Register
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
