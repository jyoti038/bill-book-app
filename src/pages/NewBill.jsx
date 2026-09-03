import { useEffect, useState } from "react";
import {
  User,
  Package,
  Plus,
  Trash2,
  Save,
  Receipt,
} from "lucide-react";
import { addNotification } from "../components/notifications";
function NewBill() {
  const [customers, setCustomers] = useState([]);
  const [stock, setStock] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const [billItems, setBillItems] = useState([]);

  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [discount, setDiscount] = useState(0);
  const [received, setReceived] = useState(0);
  const [previousBalance, setPreviousBalance] = useState(0);
  const [businessName, setBusinessName] = useState("Manish Tent House");

  useEffect(() => {
  const savedCustomers = JSON.parse(
    localStorage.getItem("mth_customers") || "[]"
  );

  const savedStock = JSON.parse(
    localStorage.getItem("mth_stock") || "[]"
  );

  const savedSettings = JSON.parse(
    localStorage.getItem("mth_settings") || "{}"
  );

  setCustomers(savedCustomers);
  setStock(savedStock);

  setBusinessName(
    savedSettings.businessName || "Manish Tent House"
  );
}, []);

 const handleCustomerChange = (id) => {
  setCustomerId(id);

  if (!id) {
    setCustomerDetails({
      name: "",
      mobile: "",
      address: "",
    });

    setPreviousBalance(0);
    return;
  }

  const selectedCustomer = customers.find(
    (customer) => String(customer.id) === String(id)
  );

  if (!selectedCustomer) {
    setCustomerDetails({
      name: "",
      mobile: "",
      address: "",
    });

    setPreviousBalance(0);
    return;
  }

  setCustomerDetails({
    name: selectedCustomer.name || "",
    mobile: selectedCustomer.mobile || "",
    address: selectedCustomer.address || "",
  });

  // Get customer's previous outstanding balance
  setPreviousBalance(
    Number(selectedCustomer.balance || 0)
  );
};

  const addItem = () => {
    if (!selectedItem) {
      alert("Please select an item.");
      return;
    }

    const item = stock.find(
      (item) => String(item.id) === String(selectedItem)
    );

    if (!item) return;

    if (quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    if (quantity > item.quantity) {
      alert(`Only ${item.quantity} units available.`);
      return;
    }

    const existingItem = billItems.find(
      (billItem) => billItem.id === item.id
    );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + Number(quantity);

      if (newQuantity > item.quantity) {
        alert(`Only ${item.quantity} units available.`);
        return;
      }

      setBillItems((prev) =>
        prev.map((billItem) =>
          billItem.id === item.id
            ? {
                ...billItem,
                quantity: newQuantity,
                amount: newQuantity * item.rate,
              }
            : billItem
        )
      );
    } else {
      setBillItems((prev) => [
        ...prev,
        {
          id: item.id,
          name: item.name,
          category: item.category,
          rate: item.rate,
           mrp: item.mrp || item.rate,
          quantity: Number(quantity),
          amount: Number(quantity) * item.rate,
        },
      ]);
    }

    setSelectedItem("");
    setQuantity(1);
  };

  const removeItem = (id) => {
    setBillItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const subtotal = billItems.reduce(
    (total, item) => total + item.amount,
    0
  );

  const discountAmount = Math.min(
    Number(discount) || 0,
    subtotal
  );

  const grandTotal = Math.max(
    0,
    subtotal - discountAmount
  );

  const receivedAmount = Math.min(
    Number(received) || 0,
    grandTotal
  );

  const balance = grandTotal - receivedAmount;

  const formatMoney = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN")}`;

  const generateBill = () => {
    if (!customerId) {
      alert("Please select a customer.");
      return;
    }

    if (billItems.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    const bills = JSON.parse(
      localStorage.getItem("mth_bills") || "[]"
    );

    const savedSettings = JSON.parse(
  localStorage.getItem("mth_settings") || "{}"
);

const billPrefix = savedSettings.billPrefix || "MTH";
const nextBillNumber = Number(
  savedSettings.nextBillNumber || 1
);

const billNumber = `${billPrefix}-${String(
  nextBillNumber
).padStart(4, "0")}`;

    const currentBalance =
  Number(previousBalance || 0) + Number(balance || 0);

const newBill = {
  id: Date.now(),
  billNumber,
  customer: customerDetails,
  items: billItems,
  subtotal,
  discount: discountAmount,
  grandTotal,
  received: receivedAmount,
  balance,
  previousBalance: Number(previousBalance || 0),
  currentBalance,
  date: new Date().toISOString(),
};

localStorage.setItem(
  "mth_bills",
  JSON.stringify([newBill, ...bills])
);
const updatedSettings = {
  ...savedSettings,
  nextBillNumber: nextBillNumber + 1,
};

localStorage.setItem(
  "mth_settings",
  JSON.stringify(updatedSettings)
);

// 🔔 Create notification
addNotification({
  type: "bill",
  title: "New Bill Generated",
  message: `${
    customerDetails.name || "Customer"
  } • ₹${Number(grandTotal).toLocaleString("en-IN")}`,
});

// Tell Header to refresh notifications immediately
window.dispatchEvent(
  new Event("mth-notifications-updated")
);
    // =========================
// UPDATE CUSTOMER BALANCE
// =========================

const updatedCustomers = customers.map((customer) => {
  if (String(customer.id) === String(customerId)) {
    return {
      ...customer,
      balance: currentBalance,
    };
  }

  return customer;
});

localStorage.setItem(
  "mth_customers",
  JSON.stringify(updatedCustomers)
);

setCustomers(updatedCustomers);

    // Reduce stock
    const updatedStock = stock.map((stockItem) => {
      const billItem = billItems.find(
        (item) => item.id === stockItem.id
      );

      if (!billItem) return stockItem;

      return {
        ...stockItem,
        quantity:
          stockItem.quantity - billItem.quantity,
      };
    });

    localStorage.setItem(
      "mth_stock",
      JSON.stringify(updatedStock)
    );

    alert(`Bill ${billNumber} generated successfully!`);

    // Reset
    setCustomerId("");
    setCustomerDetails({
      name: "",
      mobile: "",
      address: "",
    });
    setPreviousBalance(0);
    setBillItems([]);
    setDiscount(0);
    setReceived(0);
    setStock(updatedStock);
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Create New Bill</h1>
          <p>
  Create a bill for your {businessName} customer.
</p>
        </div>

        <div className="bill-number-preview">
          <Receipt size={17} />
          New Bill
        </div>
      </div>

      <div className="billing-layout">
       {/* CUSTOMER */}

<section className="bill-card">

  <div className="bill-card-header">

    <div className="bill-section-icon">
      <User size={18} />
    </div>

    <div>
      <h2>Customer Details</h2>
      <p>Select an existing customer.</p>
    </div>

  </div>

  <div className="bill-card-body">

    <div className="form-group">

      <label>Select Customer *</label>

      <select
        value={customerId}
        onChange={(e) =>
          handleCustomerChange(e.target.value)
        }
      >

        <option value="">
          -- Select Customer --
        </option>

        {customers.map((customer) => (

          <option
            key={customer.id}
            value={customer.id}
          >
            {customer.name} - {customer.mobile}
          </option>

        ))}

      </select>

    </div>


    {/* SELECTED CUSTOMER */}

    {customerDetails.name && (

      <div className="selected-customer">

        <strong>
          {customerDetails.name}
        </strong>

        <span>
          {customerDetails.mobile}
        </span>

        <span>
          {customerDetails.address || "No address"}
        </span>


        {/* PREVIOUS BALANCE */}

        <div
          style={{
            marginTop: "12px",
            paddingTop: "10px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <span
            style={{
              fontSize: "11px",
              color: "#6b7280",
            }}
          >
            Previous Balance
          </span>

          <strong
            style={{
              fontSize: "13px",
              color:
                Number(previousBalance) > 0
                  ? "#dc2626"
                  : "#16a34a",
            }}
          >
            ₹
            {Number(
              previousBalance || 0
            ).toLocaleString("en-IN")}
          </strong>

        </div>

      </div>

    )}


    {customers.length === 0 && (

      <div className="bill-warning">
        No customers found. Please add a customer
        first.
      </div>

    )}

  </div>

</section>
        {/* ITEMS */}
        <section className="bill-card">
          <div className="bill-card-header">
            <div className="bill-section-icon">
              <Package size={18} />
            </div>

            <div>
              <h2>Items</h2>
              <p>Add items to this bill.</p>
            </div>
          </div>

          <div className="bill-card-body">
            <div className="add-item-row">
              <div className="form-group item-select">
                <label>Select Item *</label>

                <select
                  value={selectedItem}
                  onChange={(e) =>
                    setSelectedItem(e.target.value)
                  }
                >
                  <option value="">
                    -- Select Item --
                  </option>

                  {stock.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      disabled={item.quantity === 0}
                    >
                      {item.name} — ₹{item.rate} (
                      {item.quantity} available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group quantity-input">
                <label>Qty</label>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                />
              </div>

              <button
                className="add-item-button"
                onClick={addItem}
              >
                <Plus size={18} />
                Add
              </button>
            </div>

            {billItems.length > 0 && (
              <div className="bill-items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Rate</th>
                      <th>MRP</th>
                      <th>Qty</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {billItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.name}</strong>
                        </td>

                        <td>
                           {formatMoney(item.rate)}
                        </td>

                        <td>
                           {formatMoney(item.mrp)}
                        </td>


                        <td>{item.quantity}</td>

                        <td>
                          <strong>
                            {formatMoney(item.amount)}
                          </strong>
                        </td>

                        <td>
                          <button
                            className="remove-item"
                            onClick={() =>
                              removeItem(item.id)
                            }
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {billItems.length === 0 && (
              <div className="no-bill-items">
                <Package size={28} />

                <p>
                  No items added to this bill yet.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* TOTAL */}
        <section className="bill-card total-card">
          <div className="bill-card-header">
            <div className="bill-section-icon">
              <Receipt size={18} />
            </div>

            <div>
              <h2>Bill Summary</h2>
              <p>Review payment details.</p>
            </div>
          </div>

          <div className="bill-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatMoney(subtotal)}</strong>
            </div>

            <div className="summary-row discount-row">
              <span>Discount</span>

              <div className="discount-input">
                <span>₹</span>

                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="summary-divider" />

            <div className="summary-row grand-total">
              <span>Grand Total</span>
              <strong>
                {formatMoney(grandTotal)}
              </strong>
            </div>

            <div className="summary-row payment-row">
              <span>Received</span>

              <input
                type="number"
                min="0"
                value={received}
                onChange={(e) =>
                  setReceived(e.target.value)
                }
              />
            </div>

            <div className="balance-row">
              <span>Balance Due</span>

              <strong>{formatMoney(balance)}</strong>
            </div>

            <button
              className="generate-bill-button"
              onClick={generateBill}
            >
              <Save size={18} />
              Generate Bill
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default NewBill;