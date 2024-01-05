import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import AddCompany from "./pages/AddCompany";
import "./App.css";
import ServiceInvoice from "./pages/ServiceInvoice";
import ShowCompany from "./pages/ShowCompany";
import PastInvoices from "./pages/PastInvoices";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/addCompany" element={<AddCompany />} />
        <Route path="/generateServiceInvoice" element={<ServiceInvoice />} />
        <Route path="/getCompanies" element={<ShowCompany />} />
        <Route path="/generateSalesInvoice" element={<ServiceInvoice />} />
        <Route path="/getPastInvoices" element={<PastInvoices />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
