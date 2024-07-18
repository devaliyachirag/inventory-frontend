import React, { useState } from "react";
import styled from "@emotion/styled";
import bg from "../../assets/images/bgcrm.png";
import LoginForm from "./Loginform";
import RegisterForm from "./RegisterForm";
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(${bg});
  height: 100vh;
  background-size: cover;
  background-position: center;
  backdrop-filter: blur(30px);
`;

const Form = styled.div`
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(30px);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  text-align: left;
  width: 500px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 50px;
  background: -webkit-linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(43, 43, 196, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
  letter-spacing: 1.5px;
  margin: 0 0 33px 0;
`;

const ToggleLink = styled.a`
  color: blue;
  cursor: pointer;
  margin-top: 10px;
  display: inline-block;
`;

const App: React.FC = () => {
  const [showLoginForm, setShowLoginForm] = useState(true);

  return (
    <Container>
      <Form>
      {showLoginForm ? (
        <>
          <Title>Login</Title>
          <LoginForm/>
          <ToggleLink onClick={() => setShowLoginForm(false)}>
            Don't have an account? Register here.
          </ToggleLink>
        </>
      ) : (
        <>
          <Title>Register</Title>
          <RegisterForm onSuccess={() => setShowLoginForm(true)} />
          <ToggleLink onClick={() => setShowLoginForm(true)}>
            Already have an account? Login here.
          </ToggleLink>
        </>
      )}
    </Form> 
    </Container>
  );
};

export default App;
