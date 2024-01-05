const mongoose = require("mongoose");
const np = require("number-precision");

const InvoiceSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    invoice_no: {
      type: Number,
      required: true,
      unique: true,
    },
    invoice_date: {
      type: Date,
      required: true,
    },
    f_year: {
      type: String,
      required: true,
    },
    terms_of_delivery: {
      type: String,
      default: "",
    },
    consumer_order_no: {
      type: String,
      default: "",
    },
    paid: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: [],
    },
    c_gst: {
      type: Number,
      default: 9,
    },
    s_gst: {
      type: Number,
      default: 9,
    },
  },
  { timestamps: true }
);

InvoiceSchema.pre("save", function (next) {
  this.items = this.items.map((item) => {
    // checking if the particular is empty or rate is 0

    if (item.type === "heading") return item;
    item.quantity = Number(item.quantity);
    item.rate = Number(item.rate);

    // rouding the values
    item.rate = np.round(item.rate, 2);

    return item;
  });
  this.invoice_no = Number(this.invoice_no);
  next();
});

module.exports = mongoose.model("Invoice", InvoiceSchema);

/* Invoice JSON format
{
  "customer": "65741def6a89f73f96782755",
  "invoice_no": 123,
  "invoice_date": "10/12/2023",
  "f_year": "23-24",
  "terms_of_delivery": "Net 30 Days",
  "consumer_order_no": "PPO/1211",
  "paid": false,
  "items": [
    {
      "type": "heading",
      "particular": "Room no. 203"
    },
    {
      "type": "product",
      "particular" : "service charge",
      "quantity" : "1",
      "rate": "2",
      "per": "Ft."
    }
  ],
  "c_gst": 9,
  "s_gst": 9
}
*/
