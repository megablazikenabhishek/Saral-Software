import React from "react";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Item from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import axios from "axios";
import moment from "moment";
import { BACKEND_URL } from "../secrets";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import np from "number-precision";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SaveIcon from "@mui/icons-material/Save";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./serviceInvoice.css";

const ServiceInvoice = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const bill_no = searchParams.get("id");

  const [companyData, setCompanyData] = React.useState([]);
  const [selectedCompany, setSelectedCompany] = React.useState("");
  const [selectedCompanyData, setSelectedCompanyData] = React.useState({});
  const [invoice_no, setInvoice_no] = React.useState(0);
  const [f_year, setF_year] = React.useState("23-24");
  const [invoice_date, setInvoice_date] = React.useState(
    moment().format("DD/MM/YYYY")
  );
  const [items, setItems] = React.useState([]);
  const [terms_of_delivery, setTerms_of_delivery] = React.useState("");
  const [consumer_order_no, setConsumer_order_no] = React.useState("");
  const [total, setTotal] = React.useState(0);

  console.log("items", items);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getCompanies`);
        console.log(response);
        if (response.status === 200) {
          setCompanyData((prev) => {
            return response.data.companies.map((item) => ({
              label: item.name,
              id: item._id,
            }));
          });
        } else {
          console.log("Error in fetching companies");
          alert("Error in fetching companies");
        }
      } catch (error) {
        console.log(error);
        alert("Error in fetching companies");
      }
    };
    const fetchLastInvoiceNumber = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getLastInvoiceNumber`);
        if (response.status === 200) {
          setInvoice_no(Number(response.data.invoice_no) + 1);
        } else {
          console.log("Error in fetching last invoice number");
          alert("Error in fetching last invoice number");
        }
      } catch (error) {
        console.log(error);
        alert("Error in fetching last invoice number");
      }
    };
    fetchLastInvoiceNumber();
    fetchData();
  }, []);

  React.useEffect(() => {
    if (selectedCompany) {
      try {
        const fetchData = async () => {
          const response = await axios.get(
            `${BACKEND_URL}/getCompany/${selectedCompany}`
          );
          console.log(response);
          if (response.status === 200) {
            setSelectedCompanyData(response.data.company);
          } else {
            console.log("Error in fetching company");
            alert("Error in fetching company");
          }
        };
        fetchData();
      } catch (error) {
        console.log(error);
        alert("Error in fetching company");
      }
    }
  }, [selectedCompany]);

  React.useEffect(() => {
    if (bill_no) {
      try {
        const fetchData = async () => {
          const response = await axios.get(
            `${BACKEND_URL}/getInvoiceData/${bill_no}`
          );
          console.log(response);
          if (response.status === 200) {
            const invoice = response.data.invoice;
            setInvoice_no(invoice.invoice_no);
            setF_year(invoice.f_year);
            setInvoice_date(moment(invoice.invoice_date).format("DD/MM/YYYY"));
            setItems(invoice.items);
            setTerms_of_delivery(invoice.terms_of_delivery);
            setConsumer_order_no(invoice.consumer_order_no);
            setSelectedCompany(invoice.customer);
          } else {
            console.log("Error in fetching invoice");
            alert("Error in fetching invoice");
          }
        };
        fetchData();
      } catch (error) {
        console.log(error);
        alert(error.response ? error.response.data.message : String(error));
      }
    }
  }, [bill_no]);

  React.useEffect(() => {
    let total = 0;
    items.forEach((item) => {
      total = np.plus(total, np.round(np.times(item.quantity, item.rate), 2));
    });
    total = np.round(total, 2);
    setTotal(total);
  }, [items]);

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...items];
    list[index][name] = value;
    setItems(list);
  };
  const handleDelete = (index) => {
    return () => {
      const list = [...items];
      list.splice(index, 1);
      setItems(list);
    };
  };

  const renderItems = () => {
    let serial_no = 0;
    return items.map((item, index) => {
      if (item.type === "heading") {
        return (
          <TableRow key={index}>
            <TableCell align="right"></TableCell>
            <TableCell align="left">
              <TextField
                id="outlined-basic"
                variant="outlined"
                size="small"
                defaultValue={item.particular}
                fullWidth
                name="particular"
                onBlur={(e) => handleItemChange(e, index)}
              />
            </TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="right"></TableCell>
            <TableCell align="center">
              <IconButton aria-label="delete" onClick={handleDelete(index)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        );
      } else {
        serial_no++;
        return (
          <TableRow key={index}>
            <TableCell align="right">{serial_no}</TableCell>
            <TableCell align="left">
              <TextField
                id="outlined-basic"
                variant="outlined"
                size="small"
                defaultValue={item.particular}
                fullWidth
                name="particular"
                onBlur={(e) => handleItemChange(e, index)}
              />
            </TableCell>
            <TableCell align="center">
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="number"
                size="small"
                defaultValue={item.quantity}
                name="quantity"
                onBlur={(e) => handleItemChange(e, index)}
              />
            </TableCell>
            <TableCell align="center">
              <TextField
                id="outlined-basic"
                variant="outlined"
                size="small"
                fullWidth
                type="number"
                defaultValue={item.rate}
                name="rate"
                onBlur={(e) => handleItemChange(e, index)}
              />
            </TableCell>
            <TableCell align="center">
              <Select
                defaultValue={item.per}
                size="small"
                name="per"
                onBlur={(e) => handleItemChange(e, index)}
              >
                <MenuItem value="No.">No</MenuItem>
                <MenuItem value="Ft.">Ft</MenuItem>
                <MenuItem value="Kg.">Kg</MenuItem>
              </Select>
            </TableCell>
            <TableCell align="right">
              <TextField
                id="outlined-basic"
                variant="outlined"
                size="small"
                fullWidth
                disabled
                value={np.round(np.times(item.quantity, item.rate), 2)}
              />
            </TableCell>
            <TableCell align="center">
              <IconButton aria-label="delete" onClick={handleDelete(index)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        );
      }
    });
  };

  const handleAddItem = (type) => {
    if (type === "heading") {
      setItems((prev) => [
        ...prev,
        {
          type: "heading",
          particular: "",
          quantity: 1,
          rate: 0,
          per: "No.",
          serial_no: 0,
        },
      ]);
    } else {
      setItems((prev) => [
        ...prev,
        {
          type: "product",
          particular: "",
          quantity: 1,
          rate: 0,
          per: "No.",
          serial_no: 0,
        },
      ]);
    }
    window.scrollTo(0, document.body.scrollHeight);
  };

  const handleSaveInvoice = async () => {
    let url = "/generateInvoice";
    if (bill_no) {
      url = `/updateInvoice/${bill_no}`;
    }
    try {
      //  check for empty fields in items
      const fixed_items = items.filter((item) => item.particular !== "");
      const response = await axios.post(`${BACKEND_URL}${url}`, {
        invoice_no,
        invoice_date,
        customer: selectedCompany,
        f_year,
        terms_of_delivery,
        consumer_order_no,
        items: fixed_items,
        cgst: 9,
        sgst: 9,
      });
      console.log(response);
      if (response.status === 200) {
        alert("Invoice Saved Successfully");
        // navigate(`?id=${response.data.invoice._id}`);
        window.location.href = `?id=${response.data.invoice._id}`;
      } else {
        alert("Error in saving invoice");
      }
    } catch (error) {
      console.log(error);
      alert(error.response ? error.response.data.message : String(error));
    }
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        width: "90%",
        margin: "auto",
        padding: "0.5rem",
      }}
    >
      <Stack
        spacing={3}
        direction="column"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Typography variant="h3" component="h4" fontFamily="monospace">
          Generate Service Invoice
        </Typography>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <Item>
            <Stack spacing={2} direction="column">
              {bill_no ? (
                <TextField
                  id="outlined-multiline-static"
                  label="Customer Name"
                  value={
                    selectedCompanyData.name ? selectedCompanyData.name : ""
                  }
                  disabled
                  fullWidth
                />
              ) : (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={companyData}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Customer Name" />
                  )}
                  onChange={(event, value) => {
                    setSelectedCompany(value.id);
                  }}
                  disableClearable
                />
              )}
              <TextField
                id="outlined-multiline-static"
                label="Customer Address"
                multiline
                maxRows={5}
                value={
                  selectedCompanyData.address ? selectedCompanyData.address : ""
                }
                disabled
              />
              <TextField
                id="outlined-multiline-static"
                label="Customer GST No."
                value={
                  selectedCompanyData.gst_no ? selectedCompanyData.gst_no : ""
                }
                disabled
              />
              <TextField
                id="outlined-multiline-static"
                label="Customer Order No."
                value={consumer_order_no}
                onChange={(event) => {
                  setConsumer_order_no(event.target.value);
                }}
              />
            </Stack>
          </Item>
          <Item>
            <Stack spacing={2} direction="column">
              <TextField
                id="outlined-multiline-static"
                label="Invoice No."
                value={invoice_no}
                onChange={(event) => {
                  setInvoice_no(Number(event.target.value));
                }}
              />
              <TextField
                id="outlined-multiline-static"
                label="financial year"
                value={f_year}
                onChange={(event) => {
                  setF_year(event.target.value);
                }}
              />
              <TextField
                id="outlined-multiline-static"
                type="date"
                label="Invoice Date"
                defaultValue={moment().format("YYYY-MM-DD")}
                onChange={(event) => {
                  setInvoice_date(
                    moment(event.target.value, "YYYY-MM-DD").format(
                      "DD/MM/YYYY"
                    )
                  );
                }}
              />
              <TextField
                id="outlined-multiline-static"
                label="Terms of delivery"
                value={terms_of_delivery}
                onChange={(event) => {
                  setTerms_of_delivery(event.target.value);
                }}
              />
            </Stack>
          </Item>
        </Stack>
        <Divider orientation="horizontal" flexItem />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="right">No.</TableCell>
                <TableCell align="left" width={300}>
                  Particular
                </TableCell>
                <TableCell align="center" width={100}>
                  Qty
                </TableCell>
                <TableCell align="center" width={150}>
                  Rate
                </TableCell>
                <TableCell align="center" width={100}>
                  Unit
                </TableCell>
                <TableCell align="right" width={150}>
                  Amount
                </TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* for items */}
              {renderItems(items)}
            </TableBody>
          </Table>
        </TableContainer>
        <div>
          <Button
            variant="contained"
            color="secondary"
            endIcon={<AddIcon />}
            sx={{ marginRight: "1rem" }}
            onClick={() => {
              handleAddItem("heading");
            }}
            size="small"
          >
            Add heading
          </Button>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            onClick={() => {
              handleAddItem("product");
            }}
            size="small"
          >
            Add item
          </Button>
        </div>
        <FormControl id="total" sx={{ m: 1 }} variant="filled">
          <InputLabel htmlFor="filled-adornment-amount">Total</InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            disabled
            startAdornment={
              <InputAdornment position="start">₹{total}</InputAdornment>
            }
          />
        </FormControl>
        <FormControl id="total" sx={{ m: 1 }} variant="filled">
          <InputLabel htmlFor="filled-adornment-amount">CGST@9%</InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            disabled
            startAdornment={
              <InputAdornment position="start">
                ₹{np.round(np.times(total, np.divide(9, 100)), 2).toFixed(2)}
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl id="total" sx={{ m: 1 }} variant="filled">
          <InputLabel htmlFor="filled-adornment-amount">SGST@9%</InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            disabled
            startAdornment={
              <InputAdornment position="start">
                ₹{np.round(np.times(total, np.divide(9, 100)), 2).toFixed(2)}
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl id="total" sx={{ m: 1 }} variant="filled">
          <InputLabel htmlFor="filled-adornment-amount">Grand Total</InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            disabled
            startAdornment={
              <InputAdornment position="start">
                ₹
                {np
                  .round(
                    np.plus(
                      total,
                      np.times(np.times(total, np.divide(9, 100)), 2)
                    ),
                    2
                  )
                  .toFixed(2)}
              </InputAdornment>
            }
          />
        </FormControl>
        <div>
          {bill_no && (
            <Button
              variant="contained"
              color="secondary"
              endIcon={<LocalPrintshopIcon />}
              sx={{ marginRight: "1rem" }}
              onClick={() => {
                window.open(`${BACKEND_URL}/getInvoice/${bill_no}`, "_blank");
              }}
              size="large"
            >
              Print
            </Button>
          )}
          <Button
            variant="contained"
            endIcon={<SaveIcon />}
            onClick={handleSaveInvoice}
            size="large"
          >
            Save
          </Button>
        </div>
      </Stack>
    </div>
  );
};

export default ServiceInvoice;
