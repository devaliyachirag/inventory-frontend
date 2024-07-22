// src/components/DatePickerComponent.tsx

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TextField, InputAdornment } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import styled from "@emotion/styled";

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container {
    width: 100%;
  }
  .react-datepicker__input-container input {
    padding-right: 40px; /* Space for the icon */
  }
`;

interface DatePickerComponentProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  label: string;
  error?: boolean;
  helperText?: string;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  selected,
  onChange,
  label,
  error,
  helperText,
}) => {
  return (
    <DatePickerWrapper>
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        placeholderText={`Select ${label}`}
        customInput={
          <TextField
            fullWidth
            margin="normal"
            label={label}
            error={error}
            helperText={helperText}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarTodayIcon />
                </InputAdornment>
              ),
            }}
          />
        }
        className={`form-control ${error ? "is-invalid" : ""}`}
      />
    </DatePickerWrapper>
  );
};

export default DatePickerComponent;
