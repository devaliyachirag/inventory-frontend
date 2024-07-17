import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styled from "@emotion/styled";
import axiosInstance from "./axiosInstance";

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

const RadioWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RadioInput = styled.input`
  margin-right: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

interface IRegisterInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
}

interface RegisterFormProps {
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IRegisterInput>();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IRegisterInput> = async (data) => {
    try {
      const response = await axiosInstance.post("/register", data);
      onSuccess(); 
    } catch (error: any) {
      if (error.response) {
        setServerError(error.response.data.message);
      } else {
        setServerError("An error occurred. Please try again.");
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(
      (prevShowConfirmPassword) => !prevShowConfirmPassword
    );
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && <ErrorMessage>{serverError}</ErrorMessage>}
      <InputWrapper>
        <Input
          type="text"
          placeholder="First Name"
          {...register("firstname", {
            required: "First name is required",
          })}
        />
        {errors.firstname && (
          <ErrorMessage>{errors.firstname.message}</ErrorMessage>
        )}
      </InputWrapper>
      <InputWrapper>
        <Input
          type="text"
          placeholder="Last Name"
          {...register("lastname", {
            required: "Last name is required",
          })}
        />
        {errors.lastname && (
          <ErrorMessage>{errors.lastname.message}</ErrorMessage>
        )}
      </InputWrapper>
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
            required: "Email is required",
          })}
        />
        {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
      </InputWrapper>
      <InputWrapper>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password", {
            required: "Please enter the password",
          })}
        />
        <ToggleButton type="button" onClick={togglePasswordVisibility}>
          {errors.password?.message ? null : showPassword ? "hide" : "show"}
        </ToggleButton>
        {errors.password && (
          <ErrorMessage>{errors.password.message}</ErrorMessage>
        )}
      </InputWrapper>
      <InputWrapper>
        <Input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm Password"
          {...register("confirmPassword", {
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
            required: "Please confirm the password",
          })}
        />
        <ToggleButton type="button" onClick={toggleConfirmPasswordVisibility}>
          {errors.password?.message ? null : showConfirmPassword ? "hide" : "show"}
        </ToggleButton>
        {errors.confirmPassword && (
          <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
        )}
      </InputWrapper>
      <RadioWrapper>
        <RadioLabel>
          <RadioInput
            type="radio"
            value="male"
            {...register("gender", { required: "Please select your gender" })}
          />
          Male
        </RadioLabel>
        <RadioLabel>
          <RadioInput
            type="radio"
            value="female"
            {...register("gender", { required: "Please select your gender" })}
          />
          Female
        </RadioLabel>
        <RadioLabel>
          <RadioInput
            type="radio"
            value="other"
            {...register("gender", { required: "Please select your gender" })}
          />
          Other
        </RadioLabel>
      </RadioWrapper>
      {errors.gender && <ErrorMessage>{errors.gender.message}</ErrorMessage>}
      <Button type="submit">Register</Button>
    </Form>
  );
};

export default RegisterForm;
