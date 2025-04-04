import React, { useState } from "react";
import { Button, Card, Container, Form, Modal } from "react-bootstrap";
import "./LoginPage.css";
import authService from "../../services/authService";

export default function LoginPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted');
      // form logic processing
    }
  };

  return (
    <div className="background-image-example">
      <section className="vh-100">
        <div className="container py-5 h-100" id="main-container">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: '1rem' }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="https://media.istockphoto.com/id/1277719288/photo/street-food-meat-cutlet-burgers-are-in-paper-boxes-food-delivery.jpg?s=612x612&w=0&k=20&c=DFjDsXpSuR_y82U-D8a1rvZi85bcVs7n9-bafyP3YWc="
                      alt="login form"
                      className="img-fluid"
                      style={{ borderRadius: '1rem 0 0 1rem' }} />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <button className="btn btn-primary" onClick={authService.login}>Sign In</button>
                      <div className="text-center">or</div>

                      <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>
                        Don't have an account?
                        <button
                          className="btn btn-success btn-lg btn-block"
                          type="button"
                          onClick={() => setShowModal(true)}
                        >
                          Sign up
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Register Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
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
                    {errors.username && <small className="text-danger">{errors.username}</small>}
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
                    {errors.email && <small className="text-danger">{errors.email}</small>}
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
                    {errors.password && <small className="text-danger">{errors.password}</small>}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label htmlFor="reg-confirm-password" className="col-form-label">
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
                    {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
                  </div>

                  {/* Submit Button */}
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary" disabled={Object.keys(errors).length > 0}>
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
