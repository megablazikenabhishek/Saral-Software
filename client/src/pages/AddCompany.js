import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { BACKEND_URL } from "../secrets";

const AddCompany = () => {
  const [companyData, setCompanyData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    gst_no: "", // Updated field name
  });

  const [errors, setErrors] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    gst_no: "", // Updated field name
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);

  const handleChange = (field, value) => {
    setCompanyData({
      ...companyData,
      [field]: value,
    });

    // Clear the corresponding error when the user types
    setErrors({
      ...errors,
      [field]: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation, you can customize this based on your requirements
    if (!companyData.name.trim()) {
      newErrors.name = "Company Name is required";
    }

    if (!companyData.address.trim()) {
      newErrors.address = "Company Address is required";
    }

    if (!companyData.gst_no.trim()) {
      // Updated field name
      newErrors.gst_no = "GST No is required"; // Updated field name
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        setErrorAlert(false);
        setResponseMessage("");
        // Send data to the server using Axios
        const response = await axios.post(
          `${BACKEND_URL}/addCompany`,
          companyData
        );
        console.log("Server response:", response.data);
        setLoading(false);

        // Check the server response status
        if (response.status === 200) {
          setResponseMessage(response.data.message);
        } else {
          setErrorAlert(true);
          setResponseMessage(response.data.message);
          // Handle any error logic here
        }
      } catch (error) {
        console.error("Error sending data to the server:", error);
        if (error.code === "ERR_NETWORK")
          setResponseMessage(
            "Error connecting to the server, please try again later"
          );
        else setResponseMessage(error.response.data.message);
        setLoading(false);
        setErrorAlert(true);
        // Handle any error logic here
      }
    }
  };

  return (
    <>
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          width: "80%",
          margin: "auto",
          padding: "0.5rem",
        }}
      >
        <Stack
          spacing={2}
          direction="column"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Display response message */}
          {responseMessage && !errorAlert && (
            <Alert severity="success">{responseMessage}</Alert>
          )}

          {/* Error alert */}
          {errorAlert && <Alert severity="error">{responseMessage}</Alert>}
          <Typography variant="h3" component="h4" fontFamily="monospace">
            Add Company
          </Typography>
          <TextField
            fullWidth
            label="Enter Company Name"
            id="name"
            value={companyData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            id="outlined-multiline-static"
            fullWidth
            label="Enter the Company Address"
            multiline
            maxRows={4}
            value={companyData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
          />
          <TextField
            fullWidth
            label="Enter Company Phone"
            id="phone"
            value={companyData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <TextField
            fullWidth
            label="Enter Company Email"
            id="email"
            value={companyData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            label="Enter GST No"
            id="gst_no" // Updated field name
            value={companyData.gst_no} // Updated field name
            onChange={(e) => handleChange("gst_no", e.target.value)} // Updated field name
            error={!!errors.gst_no} // Updated field name
            helperText={errors.gst_no} // Updated field name
          />
          {!loading && (
            <Button
              color="secondary"
              startIcon={<SaveIcon />}
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit}
            >
              <span>Save</span>
            </Button>
          )}

          {/* Loading spinner */}
          {loading && <CircularProgress style={{ marginTop: "1rem" }} />}
        </Stack>
      </div>
    </>
  );
};

export default AddCompany;
