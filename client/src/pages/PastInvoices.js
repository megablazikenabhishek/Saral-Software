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
import EditIcon from "@mui/icons-material/Edit";
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

  const [invoiceData, setInvoiceData] = React.useState([]);
  React.useEffect(() => {
    const getInvoices = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/allInvoices`);
        console.log(res.data);
        setInvoiceData(res.data.invoices);
      } catch (err) {
        console.log(err);
        alert("Something went wrong");
      }
    };
    getInvoices();
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
        sx={{ marginTop: "1rem", marginBottom: "0.5rem" }}
        color="secondary"
        onClick={() => {
          navigate("/generateServiceInvoice");
        }}
      >
        Generate Service Invoice
      </Button>
      <Button
        variant="contained"
        endIcon={<AddIcon />}
        size="large"
        sx={{ marginTop: "1rem", marginBottom: "1rem" }}
        color="secondary"
        onClick={() => {
          navigate("/generateSalesInvoice");
        }}
      >
        Generate Sales Invoice
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Invoie No</TableCell>
              <TableCell align="center">Company Name</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Total Amount</TableCell>
              <TableCell align="center">Paid</TableCell>
              <TableCell align="center">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoiceData.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.invoice_no}
                </TableCell>
                <TableCell align="center">{row.customer.name}</TableCell>
                <TableCell align="center">
                  {row.c_gst == 9 ? "Service" : "Sales"}
                </TableCell>
                <TableCell align="center">{row.total_amount}</TableCell>
                <TableCell align="center">{row.paid ? "Yes" : "No"}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    endIcon={<EditIcon />}
                    size="small"
                    onClick={() => {
                      navigate(`/generateServiceInvoice?id=${row._id}`);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ShowCompany;
