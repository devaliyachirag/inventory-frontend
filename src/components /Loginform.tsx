// LoginForm.tsx
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styled from "@emotion/styled";
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;
const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  &:focus {
    border-color: rgba(43, 43, 196, 1);
    box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 20px;
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(43, 43, 196, 1) 35%,
    rgba(0, 212, 255, 1) 100%
  );
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin: 0;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
interface ILoginInput {
  email: string;
  password: string;
}

const LoginForm: React.FC= () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginInput>();
  const onSubmit: SubmitHandler<ILoginInput> = async (data) => {
    try {
      const response = await axiosInstance.post("/login", data);;
      localStorage.setItem('token', response.data.token); // Save token in local storage
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred. Please try again.");
      }
    }
    navigate('/');
  };
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <InputWrapper>
        <Input
          type="email"
          placeholder="Email"
          {...register("email", {
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Invalid email pattern",
            },
            required: {
              value: true,
              message: "Email is required",
            },
          })}
        />
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
      </InputWrapper>
      <InputWrapper>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password", {
            required: {
              value: true,
              message: "Please enter the password",
            },
          })}
        />
        <ToggleButton type="button" onClick={togglePasswordVisibility}>
          {errors.password?.message ? null : showPassword ? "hide" : "show"}
        </ToggleButton>
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
      </InputWrapper>
      <Button type="submit">Login</Button>
    </Form>
  );
};

export default LoginForm;
