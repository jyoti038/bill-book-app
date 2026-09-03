import { useEffect, useState } from "react";
import {
  Building2,
  FileText,
  Bell,
  Database,
  Save,
  Upload,
  Download,
  Trash2,
} from "lucide-react";

function Settings() {
  const [settings, setSettings] = useState(() => {
    return JSON.parse(
      localStorage.getItem("mth_settings") ||
        JSON.stringify({
          businessName: "Manish Tent House",
          mobile: "",
          address: "",
          gstNumber: "",
          billPrefix: "MTH",
          nextBillNumber: 1,
          defaultDiscount: 0,
          showPreviousBalance: true,
          showAmountInWords: true,
          showSignature: true,
          showTerms: true,
          footerText: "Thank you for your business!",
        })
    );
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "mth_settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
  localStorage.setItem(
    "mth_settings",
    JSON.stringify(settings)
  );

  // Business name ko separately bhi save karo
  localStorage.setItem(
    "mth_business_name",
    settings.businessName
  );

  // Website ke dusre components ko update signal
  window.dispatchEvent(
    new Event("mth-business-updated")
  );

  setSaved(true);

  setTimeout(() => {
    setSaved(false);
  }, 2500);
};

  const exportBackup = () => {
    const backup = {
      settings,
      customers: JSON.parse(
        localStorage.getItem("mth_customers") || "[]"
      ),
      stock: JSON.parse(
        localStorage.getItem("mth_stock") || "[]"
      ),
      bills: JSON.parse(
        localStorage.getItem("mth_bills") || "[]"
      ),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Manish_Tent_House_Backup_${new Date()
      .toISOString()
      .split("T")[0]}.json`;

    a.click();

    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    const confirmDelete = window.confirm(
      "WARNING: This will delete all customers, stock and bills from this browser. Are you sure?"
    );

    if (!confirmDelete) return;

    const secondConfirm = window.confirm(
      "This action cannot be undone. Continue?"
    );

    if (!secondConfirm) return;

    localStorage.removeItem("mth_customers");
    localStorage.removeItem("mth_stock");
    localStorage.removeItem("mth_bills");

    alert("All business data has been cleared.");

    window.location.reload();
  };

  return (
    <div>
      {/* HEADER */}

      <div className="page-heading">
        <div>
          <h1>Settings</h1>
          <p>
            Manage your Manish Tent House business settings.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleSave}
        >
          <Save size={17} />

          {saved ? "Updated!" : "Update Business"}
        </button>
      </div>

      {/* BUSINESS PROFILE */}

      <section className="settings-card">
        <div className="settings-card-header">
          <div className="settings-icon">
            <Building2 size={19} />
          </div>

          <div>
            <h2>Business Information</h2>
            <p>
              Basic information used across your billing system.
            </p>
          </div>
        </div>

        <div className="settings-card-body">
          <div className="settings-grid">
            <div className="form-group">
              <label>Business Name</label>

              <input
                type="text"
                value={settings.businessName}
                onChange={(e) =>
                  updateSetting(
                    "businessName",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>Mobile Number</label>

              <input
                type="tel"
                placeholder="Enter business mobile"
                value={settings.mobile}
                onChange={(e) =>
                  updateSetting(
                    "mobile",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Business Address</label>

            <textarea
              rows="3"
              placeholder="Enter business address"
              value={settings.address}
              onChange={(e) =>
                updateSetting(
                  "address",
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>GST Number</label>

            <input
              type="text"
              placeholder="Optional"
              value={settings.gstNumber}
              onChange={(e) =>
                updateSetting(
                  "gstNumber",
                  e.target.value
                )
              }
            />
          </div>
        </div>
      </section>

      {/* BILL SETTINGS */}

      <section className="settings-card">
        <div className="settings-card-header">
          <div className="settings-icon">
            <FileText size={19} />
          </div>

          <div>
            <h2>Bill Settings</h2>
            <p>
              Configure how your bills are generated.
            </p>
          </div>
        </div>

        <div className="settings-card-body">
          <div className="settings-grid">
            <div className="form-group">
              <label>Bill Prefix</label>

              <input
                type="text"
                value={settings.billPrefix}
                onChange={(e) =>
                  updateSetting(
                    "billPrefix",
                    e.target.value.toUpperCase()
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>Next Bill Number</label>

              <input
                type="number"
                min="1"
                value={settings.nextBillNumber}
                onChange={(e) =>
                  updateSetting(
                    "nextBillNumber",
                    Number(e.target.value)
                  )
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Default Discount (%)</label>

            <input
              type="number"
              min="0"
              max="100"
              value={settings.defaultDiscount}
              onChange={(e) =>
                updateSetting(
                  "defaultDiscount",
                  Number(e.target.value)
                )
              }
            />
          </div>

          <div className="settings-options">
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={settings.showPreviousBalance}
                onChange={(e) =>
                  updateSetting(
                    "showPreviousBalance",
                    e.target.checked
                  )
                }
              />

              <span>
                <strong>Show Previous Balance</strong>
                <small>
                  Display customer outstanding balance on bills.
                </small>
              </span>
            </label>

            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={settings.showAmountInWords}
                onChange={(e) =>
                  updateSetting(
                    "showAmountInWords",
                    e.target.checked
                  )
                }
              />

              <span>
                <strong>Show Amount in Words</strong>
                <small>
                  Display total amount in words on the invoice.
                </small>
              </span>
            </label>

            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={settings.showSignature}
                onChange={(e) =>
                  updateSetting(
                    "showSignature",
                    e.target.checked
                  )
                }
              />

              <span>
                <strong>Show Signature</strong>
                <small>
                  Display authorised signature section.
                </small>
              </span>
            </label>

            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={settings.showTerms}
                onChange={(e) =>
                  updateSetting(
                    "showTerms",
                    e.target.checked
                  )
                }
              />

              <span>
                <strong>Show Terms & Conditions</strong>
                <small>
                  Display terms at the bottom of bills.
                </small>
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* BILL FOOTER */}

      <section className="settings-card">
        <div className="settings-card-header">
          <div className="settings-icon">
            <FileText size={19} />
          </div>

          <div>
            <h2>Invoice Footer</h2>
            <p>
              Customize the message shown at the bottom of your bill.
            </p>
          </div>
        </div>

        <div className="settings-card-body">
          <div className="form-group">
            <label>Footer Message</label>

            <textarea
              rows="3"
              value={settings.footerText}
              onChange={(e) =>
                updateSetting(
                  "footerText",
                  e.target.value
                )
              }
            />
          </div>
        </div>
      </section>

      {/* NOTIFICATIONS */}

      <section className="settings-card">
        <div className="settings-card-header">
          <div className="settings-icon">
            <Bell size={19} />
          </div>

          <div>
            <h2>Notifications</h2>
            <p>
              Control business notifications.
            </p>
          </div>
        </div>

        <div className="settings-card-body">
          <div className="settings-options">
            <label className="setting-toggle">
              <input
                type="checkbox"
                defaultChecked
              />

              <span>
                <strong>Bill Notifications</strong>
                <small>
                  Notify when a new bill is generated.
                </small>
              </span>
            </label>

            <label className="setting-toggle">
              <input
                type="checkbox"
                defaultChecked
              />

              <span>
                <strong>Low Stock Alerts</strong>
                <small>
                  Get alerts when stock reaches a low level.
                </small>
              </span>
            </label>

            <label className="setting-toggle">
              <input
                type="checkbox"
                defaultChecked
              />

              <span>
                <strong>Payment Alerts</strong>
                <small>
                  Show notifications for pending payments.
                </small>
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* DATA MANAGEMENT */}

      <section className="settings-card">
        <div className="settings-card-header">
          <div className="settings-icon">
            <Database size={19} />
          </div>

          <div>
            <h2>Data Management</h2>
            <p>
              Backup and manage your business data.
            </p>
          </div>
        </div>

        <div className="settings-card-body">
          <div className="settings-actions">

            <button
              className="secondary-button"
              onClick={exportBackup}
            >
              <Download size={17} />
              Backup Data
            </button>

            <button
              className="danger-button"
              onClick={clearAllData}
            >
              <Trash2 size={17} />
              Clear All Data
            </button>

          </div>

          <div className="settings-info">
            <strong>Important</strong>
            <p>
              Keep a regular backup of your customer, stock
              and billing data. Clearing data cannot be undone.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Settings;