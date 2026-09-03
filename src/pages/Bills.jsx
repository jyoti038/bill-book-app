import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  FileText,
  IndianRupee,
} from "lucide-react";
import jsPDF from "jspdf";

function Bills() {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = () => {
    const savedBills = JSON.parse(
      localStorage.getItem("mth_bills") || "[]"
    );

    setBills(savedBills);
  };

  const formatMoney = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

    const savedSettings = JSON.parse(
    localStorage.getItem("mth_settings") || "{}"
  );

  const businessName =
    savedSettings.businessName || "Manish Tent House";


  const filteredBills = bills.filter((bill) => {
    const text = search.toLowerCase();

    return (
      bill.billNumber?.toLowerCase().includes(text) ||
      bill.customer?.name?.toLowerCase().includes(text) ||
      bill.customer?.mobile?.includes(text)
    );
  });

  const deleteBill = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bill?"
    );

    if (!confirmDelete) return;

    const updatedBills = bills.filter(
      (bill) => bill.id !== id
    );

    localStorage.setItem(
      "mth_bills",
      JSON.stringify(updatedBills)
    );

    setBills(updatedBills);
  };
const generatePDF = (bill) => {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const left = 15;
  const right = 195;

  const formatMoney = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // =========================
  // HEADER
  // =========================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
 doc.text(businessName.toUpperCase(), pageWidth / 2, 20, {
  align: "center",
});

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(
    "Tent House & Event Equipment Rental",
    pageWidth / 2,
    26,
    { align: "center" }
  );

  doc.setLineWidth(1.2);
  doc.line(left, 31, right, 31);

  // =========================
  // INVOICE INFO
  // =========================

  doc.setFillColor(235, 235, 235);
  doc.rect(left, 35, 180, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text(`Invoice No.: ${bill.billNumber}`, left + 4, 41);

  doc.text(
    `Invoice Date: ${formatDate(bill.date)}`,
    right - 4,
    41,
    { align: "right" }
  );

  // =========================
  // CUSTOMER
  // =========================

  doc.setFontSize(9);
  doc.text("BILL TO", left + 3, 55);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text(
    bill.customer?.name || "",
    left + 3,
    62
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  doc.text(
    `Mobile: ${bill.customer?.mobile || ""}`,
    left + 3,
    68
  );

  if (bill.customer?.address) {
    const addressLines = doc.splitTextToSize(
      bill.customer.address,
      95
    );

    doc.text(addressLines, left + 3, 74);
  }

  // =========================
  // ITEMS TABLE
  // =========================

  const tableTop = 88;

  doc.setFillColor(235, 235, 235);
  doc.rect(left, tableTop, 180, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text("ITEMS", 18, tableTop + 6);
  doc.text("QTY.", 112, tableTop + 6);
  doc.text("MRP", 135, tableTop + 6);
  doc.text("RATE", 158, tableTop + 6);
  doc.text("AMOUNT", 178, tableTop + 6);

  let y = tableTop + 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  bill.items?.forEach((item) => {
    doc.line(left, y, right, y);

    const itemName = doc.splitTextToSize(
      item.name || "",
      85
    );

    doc.text(itemName, 18, y + 6);

    doc.text(
      String(item.quantity),
      114,
      y + 6
    );

   const mrp = item.mrp || item.rate;

    doc.text(
      formatMoney(mrp).replace("Rs. ", ""),
      135,
      y + 6
    );

    doc.text(
      formatMoney(item.rate).replace("Rs. ", ""),
      158,
      y + 6
    );

    doc.text(
      formatMoney(item.amount).replace("Rs. ", ""),
      178,
      y + 6
    );

    y += Math.max(12, itemName.length * 5);
  });

  doc.line(left, y, right, y);

  // =========================
  // SUBTOTAL
  // =========================

  y += 12;

  doc.setFont("helvetica", "bold");
  doc.text("SUBTOTAL", left + 3, y);

  doc.text(
    String(
      bill.items?.reduce(
        (total, item) => total + Number(item.quantity),
        0
      ) || 0
    ),
    110,
    y
  );

  doc.text(
    formatMoney(bill.subtotal),
    right - 3,
    y,
    { align: "right" }
  );

  // =========================
  // TERMS
  // =========================

  y += 14;

  doc.setFontSize(9);
  doc.text("TERMS AND CONDITIONS", left + 3, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    "1. Goods once sold will not be taken back or exchanged.",
    left + 3,
    y + 6
  );

  doc.text(
    "2. All disputes are subject to jurisdiction only.",
    left + 3,
    y + 11
  );

  // =========================
  // RIGHT SUMMARY
  // =========================

  const summaryX = 125;
  let summaryY = y - 2;

  doc.setFontSize(8);

  doc.text("Total Amount", summaryX, summaryY);

  doc.text(
    formatMoney(bill.grandTotal),
    right - 3,
    summaryY,
    { align: "right" }
  );

  summaryY += 8;

  doc.text("Received Amount", summaryX, summaryY);

  doc.text(
    formatMoney(bill.received),
    right - 3,
    summaryY,
    { align: "right" }
  );

  summaryY += 8;

  doc.text("Balance", summaryX, summaryY);

  doc.text(
    formatMoney(bill.balance),
    right - 3,
    summaryY,
    { align: "right" }
  );

  summaryY += 8;

  doc.text("Previous Balance", summaryX, summaryY);

  doc.text(
    "Rs. 0",
    right - 3,
    summaryY,
    { align: "right" }
  );

  summaryY += 8;

  doc.text("Current Balance", summaryX, summaryY);

  doc.text(
    formatMoney(bill.balance),
    right - 3,
    summaryY,
    { align: "right" }
  );

  // =========================
  // TOTAL IN WORDS
  // =========================

  const totalInWords = numberToWords(
    Math.round(Number(bill.grandTotal))
  );

  summaryY += 12;

  doc.setFont("helvetica", "bold");
  doc.text(
    "Total Amount (in words)",
    summaryX,
    summaryY
  );

  doc.setFont("helvetica", "normal");

  const words = doc.splitTextToSize(
    `${totalInWords} Rupees Only`,
    70
  );

  doc.text(words, summaryX, summaryY + 6);

  // =========================
  // SIGNATURE BOX
  // =========================

  const signY = 235;

  doc.rect(125, signY, 65, 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);

  doc.text(
    "AUTHORISED SIGNATORY",
    157.5,
    signY + 34,
    { align: "center" }
  );

 doc.text(
  businessName.toUpperCase(),
  157.5,
  signY + 39,
  { align: "center" }
);

  // =========================
  // SAVE
  // =========================

  doc.save(`${bill.billNumber}.pdf`);

return doc;
};

const sharePDFOnWhatsApp = async (bill) => {
  try {

    const savedSettings = JSON.parse(
  localStorage.getItem("mth_settings") || "{}"
);

const businessName =
  savedSettings.businessName || "Manish Gupta"; 

    const doc = generatePDF(bill);

    const pdfBlob = doc.output("blob");

    const pdfFile = new File(
      [pdfBlob],
      `${bill.billNumber}.pdf`,
      {
        type: "application/pdf",
      }
    );

    // Mobile / supported browser
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({
        files: [pdfFile],
      })
    ) {
      await navigator.share({
        title: `${bill.billNumber} - ${businessName}`,
text: `Bill ${bill.billNumber} - ${businessName}`,
        files: [pdfFile],
      });

      return;
    }

    // Fallback for unsupported browsers
    const message = encodeURIComponent(
      `Hello ${bill.customer?.name || ""},\n\n` +
      `Please find your bill ${bill.billNumber} from ${businessName}.\n\n` +
      `Total Amount: ₹${Number(
        bill.grandTotal || 0
      ).toLocaleString("en-IN")}\n` +
      `Balance: ₹${Number(
        bill.balance || 0
      ).toLocaleString("en-IN")}`
    );

    window.open(
      `https://wa.me/?text=${message}`,
      "_blank"
    );

    alert(
      "PDF has been downloaded. WhatsApp opened. Please attach the downloaded PDF."
    );
  } catch (error) {
    console.error("WhatsApp sharing failed:", error);

    if (error.name !== "AbortError") {
      alert(
        "Unable to share PDF. The PDF has been downloaded instead."
      );
    }
  }
};


const numberToWords = (num) => {
  if (num === 0) return "Zero";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convertBelowThousand = (n) => {
    let result = "";

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }

    if (n > 0) {
      result += ones[n] + " ";
    }

    return result.trim();
  };

  let result = "";

  if (num >= 10000000) {
    result +=
      convertBelowThousand(Math.floor(num / 10000000)) +
      " Crore ";
    num %= 10000000;
  }

  if (num >= 100000) {
    result +=
      convertBelowThousand(Math.floor(num / 100000)) +
      " Lakh ";
    num %= 100000;
  }

  if (num >= 1000) {
    result +=
      convertBelowThousand(Math.floor(num / 1000)) +
      " Thousand ";
    num %= 1000;
  }

  if (num > 0) {
    result += convertBelowThousand(num);
  }

  return result.trim();
};

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Bills</h1>
          <p>View and manage all generated bills.</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bills-toolbar">
        <div className="bills-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search bill number, customer or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bills-count">
          <FileText size={17} />
          {filteredBills.length} Bills
        </div>
      </div>

      {/* TABLE */}
      <div className="bills-panel">
        {filteredBills.length === 0 ? (
          <div className="bills-empty">
            <div className="empty-circle">
              <FileText size={28} />
            </div>

            <h3>
              {search ? "No bills found" : "No bills yet"}
            </h3>

            <p>
              {search
                ? "Try another search."
                : "Generated bills will appear here."}
            </p>
          </div>
        ) : (
          <div className="bills-table-wrapper">
            <table className="bills-table">
              <thead>
                <tr>
                  <th>Bill No.</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Received</th>
                  <th>Balance</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBills.map((bill) => (
                  <tr key={bill.id}>
                    <td>
                      <strong>{bill.billNumber}</strong>
                    </td>

                    <td>{formatDate(bill.date)}</td>

                    <td>
                      <div className="bill-customer">
                        <div className="customer-avatar">
                          {bill.customer?.name
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>
                            {bill.customer?.name}
                          </strong>

                          <small>
                            {bill.customer?.mobile}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      {bill.items?.length || 0} item
                      {bill.items?.length !== 1 ? "s" : ""}
                    </td>

                    <td>
                      <strong>
                        {formatMoney(bill.grandTotal)}
                      </strong>
                    </td>

                    <td>
                      {formatMoney(bill.received)}
                    </td>

                    <td>
                      <span
                        className={
                          Number(bill.balance) > 0
                            ? "bill-balance due"
                            : "bill-balance paid"
                        }
                      >
                        {formatMoney(bill.balance)}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-button view"
                          title="View Bill"
                          onClick={() =>
                            setSelectedBill(bill)
                          }
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          className="icon-button delete"
                          title="Delete Bill"
                          onClick={() =>
                            deleteBill(bill.id)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW BILL MODAL */}
      {selectedBill && (
        <div className="modal-overlay">
          <div className="bill-view-modal">
           <div className="modal-header">
  <div>
    <h2>{selectedBill.billNumber}</h2>

    <p>
      {formatDate(selectedBill.date)}
    </p>
  </div>

  <div className="bill-modal-actions">

  <button
    className="download-pdf-button"
    onClick={() => generatePDF(selectedBill)}
  >
    📄 Download PDF
  </button>

  <button
    className="whatsapp-button"
    onClick={() =>
      sharePDFOnWhatsApp(selectedBill)
    }
  >
    💬 Share on WhatsApp
  </button>

  <button
    className="modal-close"
    onClick={() => setSelectedBill(null)}
  >
    ×
  </button>

</div>
</div>

            <div className="bill-preview">
              <div className="preview-business">
                <h2>
  {JSON.parse(
    localStorage.getItem("mth_settings") || "{}"
  ).businessName || "Manish gupta"}
</h2>

                <p>
                  Tent House & Event Equipment Rental
                </p>
              </div>

              <div className="preview-info">
                <div>
                  <strong>BILL TO</strong>

                  <p>
                    {selectedBill.customer?.name}
                  </p>

                  <small>
                    Mobile:{" "}
                    {selectedBill.customer?.mobile}
                  </small>

                  <small>
                    {selectedBill.customer?.address}
                  </small>
                </div>

                <div className="preview-bill-number">
                  <strong>
                    Invoice No.:{" "}
                    {selectedBill.billNumber}
                  </strong>

                  <span>
                    Date:{" "}
                    {formatDate(selectedBill.date)}
                  </span>
                </div>
              </div>

              <table className="preview-items">
                <thead>
                  <tr>
                    <th>ITEMS</th>
                    <th>QTY.</th>
                    <th>MRP</th>
                    <th>RATE</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedBill.items?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>

                      <td>{item.quantity}</td>

                      <td>
                       {formatMoney(item.mrp || item.rate)}
                      </td>

                      <td>
                        {formatMoney(item.rate)}
                      </td>

                      <td>
                        {formatMoney(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="preview-summary">
                <div>
                  <span>Subtotal</span>
                  <strong>
                    {formatMoney(
                      selectedBill.subtotal
                    )}
                  </strong>
                </div>

                <div>
                  <span>Discount</span>
                  <strong>
                    {formatMoney(
                      selectedBill.discount
                    )}
                  </strong>
                </div>

                <div className="preview-total">
                  <span>Total Amount</span>
                  <strong>
                    {formatMoney(
                      selectedBill.grandTotal
                    )}
                  </strong>
                </div>

                <div>
                  <span>Received Amount</span>
                  <strong>
                    {formatMoney(
                      selectedBill.received
                    )}
                  </strong>
                </div>

                <div>
                  <span>Balance</span>
                  <strong>
                    {formatMoney(
                      selectedBill.balance
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bills;