import React from "react";
import { Helmet } from "react-helmet";
import { PasswordLoginForm } from "../components/PasswordLoginForm";
import styles from "./login.module.css";

const LoginPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Admin Login - The Crimson Phoenix</title>
      </Helmet>
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>Admin Login</h1>
          <p className={styles.subtitle}>
            Access the website management panel.
          </p>

          <div className={styles.testCredentials}>
            <h3 className={styles.testTitle}>Test Credentials</h3>
            <p>
              <strong>Username:</strong> admin
            </p>
            <p>
              <strong>Password:</strong> admin123
            </p>
          </div>

          <PasswordLoginForm />
        </div>
      </div>
    </>
  );
};

export default LoginPage;