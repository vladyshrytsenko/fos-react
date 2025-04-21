import React, { useState } from "react";
import authService from "../services/authService";
import { Button, Card, Col, Image, Row } from "react-bootstrap";

export default function LoginPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // form validation
    const newErrors: any = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted");
      // form logic processing
    }
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
                <Button variant="outline-success" size="lg" className="w-100" onClick={() => setShowModal(true)}>
                  Sign Up
                </Button>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Register Modal */}
      <div> 
          {showModal && (
            <div
              className="modal fade show"
              style={{ display: "block" }}
              onClick={() => setShowModal(false)}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      {/* Username */}
                      <div className="form-group">
                        <label htmlFor="reg-username" className="col-form-label">
                          Username:
                        </label>
                        <input
                          type="text"
                          name="username"
                          className="form-control"
                          id="reg-username"
                          value={formData.username}
                          onChange={handleInputChange}
                          required />
                        {errors.username && (
                          <small className="text-danger">{errors.username}</small>
                        )}
                      </div>

                      {/* Email */}
                      <div className="form-group">
                        <label htmlFor="reg-email" className="col-form-label">
                          Email:
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          id="reg-email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required />
                        {errors.email && (
                          <small className="text-danger">{errors.email}</small>
                        )}
                      </div>

                      {/* Password */}
                      <div className="form-group">
                        <label htmlFor="reg-password" className="col-form-label">
                          Password:
                        </label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          id="reg-password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required />
                        {errors.password && (
                          <small className="text-danger">{errors.password}</small>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="form-group">
                        <label
                          htmlFor="reg-confirm-password"
                          className="col-form-label"
                        >
                          Confirm password:
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="reg-confirm-password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required />
                        {errors.confirmPassword && (
                          <small className="text-danger">
                            {errors.confirmPassword}
                          </small>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="modal-footer">
                        <Button as="input" type="submit" variant="primary" disabled={Object.keys(errors).length > 0}>
                          Register
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </>
  );
}
