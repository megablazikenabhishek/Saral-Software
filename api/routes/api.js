const router = require("express").Router();
const Company = require("../models/Company");
const Invoice = require("../models/Invoice");
const moment = require("moment");
const np = require("number-precision");
const convertNumberToWords = require("../utils/convertNumberToWords");

const amount_formatter = (amount) => {
  return (
    Intl.NumberFormat("en-IN").format(parseInt(amount)) +
    amount.slice(amount.indexOf("."))
  );
};

router.post("/addCompany", async (req, res) => {
  try {
    const company = await Company.create(req.body);
    res
      .status(200)
      .json({ success: true, message: "Company added successfully", company });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: String(err) });
  }
});

router.get("/getCompanies", async (req, res) => {
  try {
    const companies = await Company.find({}).sort({ name: 1 });
    // giving only name and _id
    // const companies_name = companies.map((company) => ({
    //   name: company.name,
    //   _id: company._id,
    // }));
    const companies_name = companies;
    res.status(200).json({
      success: true,
      companies: companies_name,
      message: "Companies fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: String(err) });
  }
});

router.get("/getCompany/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company)
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });
    res.status(200).json({
      success: true,
      company,
      message: "Company fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: String(err) });
  }
});

// get Last invoice number
router.get("/getLastInvoiceNumber", async (req, res) => {
  try {
    const invoice = await Invoice.findOne({}).sort({ invoice_no: -1 });
    if (!invoice)
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    res.status(200).json({
      success: true,
      invoice_no: invoice.invoice_no,
      message: "Invoice fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: String(err) });
  }
});

router.post("/generateInvoice", async (req, res) => {
  try {
    req.body.invoice_date = moment(
      req.body.invoice_date,
      "DD/MM/YYYY"
    ).toDate();
    const invoice = await Invoice.create(req.body);
    res.status(200).json({
      success: true,
      message: "Invoice generated successfully",
      invoice,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: String(err) });
  }
});

router.get("/getInvoice/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("customer");
    if (!invoice)
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });

    let serial_no = 0;
    let total_amount = 0;
    invoice.items = await Promise.all(
      invoice.items.map((item) => {
        if (item.type === "heading") return item;
        // serial no
        serial_no++;
        let amount_with_precision = np
          .round(np.times(item.quantity, item.rate), 2)
          .toFixed(2);
        const amount = amount_formatter(amount_with_precision);
        total_amount = np.plus(total_amount, amount_with_precision);
        return { ...item, serial_no, amount };
      })
    );

    // total amount
    const total_amount_with_precision = np.round(total_amount, 2).toFixed(2);
    const total_amount_formatted = amount_formatter(
      total_amount_with_precision
    );
    // c_gst
    const c_gst_amount_with_precision = np
      .round(
        np.times(total_amount_with_precision, np.divide(invoice.c_gst, 100)),
        2
      )
      .toFixed(2);
    const c_gst_amount_formatted = amount_formatter(
      c_gst_amount_with_precision
    );
    // s_gst amount
    const s_gst_amount_with_precision = np
      .round(
        np.times(total_amount_with_precision, np.divide(invoice.s_gst, 100)),
        2
      )
      .toFixed(2);
    const s_gst_amount_formatted = amount_formatter(
      s_gst_amount_with_precision
    );
    // tax amount
    const tax_amount_with_precision = np
      .round(
        np.plus(c_gst_amount_with_precision, s_gst_amount_with_precision),
        2
      )
      .toFixed(2);
    const tax_amount_formatted = amount_formatter(tax_amount_with_precision);
    // grand total
    const grand_total_with_precision = np
      .round(
        np.plus(
          total_amount_with_precision,
          c_gst_amount_with_precision,
          s_gst_amount_with_precision
        ),
        2
      )
      .toFixed(2);
    const grand_total_formatted = amount_formatter(grand_total_with_precision);

    // console.log(total_amount_formatted, c_gst_amount_formatted, s_gst_amount_formatted, tax_amount_formatted, grand_total_formatted)

    no_of_rows = invoice.items.length;
    no_of_empty_rows = 14 - no_of_rows;

    // num to words
    const grand_total_in_words = convertNumberToWords(
      grand_total_with_precision
    );
    const tax_amount_in_words = convertNumberToWords(tax_amount_with_precision);

    // console.log(grand_total_in_words, tax_amount_in_words)

    final_invoice = {
      ...invoice._doc,
      total_amount: total_amount_formatted,
      c_gst_amount: c_gst_amount_formatted,
      s_gst_amount: s_gst_amount_formatted,
      tax_amount: tax_amount_formatted,
      grand_total: grand_total_formatted,
      no_of_rows,
      no_of_empty_rows,
      grand_total_in_words,
      tax_amount_in_words,
    };
    // parsing date
    final_invoice.invoice_date = moment(final_invoice.invoice_date).format(
      "DD/MM/YYYY"
    );
    console.log({ ...final_invoice });
    res.render("invoice.ejs", { ...final_invoice });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: String(err) });
  }
});

router.get("/getInvoiceData/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice)
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    res.status(200).json({
      success: true,
      invoice,
      message: "Invoice fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: String(err) });
  }
});

router.post("/updateInvoice/:id", async (req, res) => {
  try {
    const id = req.params.id;
    req.body.invoice_date = moment(
      req.body.invoice_date,
      "DD/MM/YYYY"
    ).toDate();
    console.log(req.body);
    const invoice = await Invoice.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      invoice,
      message: "Invoice updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: String(err) });
  }
});

router.get("/allInvoices", async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("customer")
      .sort({ invoice_no: -1 });
    // calculating total amount
    final_invoices = await Promise.all(
      invoices.map(async (invoice) => {
        let total_amount = 0;
        invoice.items.forEach((item) => {
          if (item.type === "heading") return;
          let amount = np
            .round(np.times(item.quantity, item.rate), 2)
            .toFixed(2);
          total_amount = np.plus(total_amount, amount);
        });
        total_amount += np.round(np.times(total_amount, np.times(np.divide(invoice.c_gst, 100), 2)), 2);
        return {
          ...invoice._doc,
          total_amount: amount_formatter(String(total_amount.toFixed(2))),
        };
      })
    );
    res.status(200).json({
      success: true,
      invoices: final_invoices,
      message: "Invoices fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: String(err) });
  }
});

module.exports = router;
