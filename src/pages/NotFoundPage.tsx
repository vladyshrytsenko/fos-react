import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.text}>Oops! Page not found.</p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center" as const,
    padding: "50px"
  },
  title: {
    fontSize: "72px",
    marginBottom: "10px"
  },
  text: {
    fontSize: "20px",
    marginBottom: "20px"
  },
  link: {
    fontSize: "18px",
    textDecoration: "none",
    color: "blue"
  }
};

export default NotFoundPage;