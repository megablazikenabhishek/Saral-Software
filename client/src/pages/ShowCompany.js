import React from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { BACKEND_URL } from "../secrets";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

function ShowCompany() {
  const [companyData, setCompanyData] = React.useState([]);
  const navigate = useNavigate();
  React.useEffect(() => {
    const getCompanies = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/getCompanies`);
        console.log(res.data);
        setCompanyData(res.data.companies);
      } catch (err) {
        console.log(err);
        alert("Something went wrong");
      }
    };
    getCompanies();
  }, []);

  return (
    <div
      style={{
        marginTop: "1rem",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        width: "80%",
        margin: "auto",
        padding: "0.5rem",
        flexDirection: "column",
      }}
    >
      <Button
        variant="contained"
        endIcon={<AddIcon />}
        size="large"
        sx={{ marginTop: "1rem", marginBottom: "1rem" }}
        color="secondary"
        onClick={() => {
          navigate("/addCompany");
        }}
      >
        Add Company
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell align="center">GST No</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Phone no</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companyData.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">{row.gst_no}</TableCell>
                <TableCell align="center">{row.email}</TableCell>
                <TableCell align="center">{row.address}</TableCell>
                <TableCell align="center">{row.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ShowCompany;
