import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Users } from "lucide-react";

function Customers() {
  const [customers, setCustomers] = useState(() => {
    return JSON.parse(localStorage.getItem("mth_customers") || "[]");
  });

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  useEffect(() => {
    localStorage.setItem("mth_customers", JSON.stringify(customers));
  }, [customers]);

  const resetForm = () => {
    setForm({
      name: "",
      mobile: "",
      address: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter customer name.");
      return;
    }

    if (!form.mobile.trim()) {
      alert("Please enter mobile number.");
      return;
    }

    if (editingId) {
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === editingId
            ? { ...customer, ...form }
            : customer
        )
      );
    } else {
      const newCustomer = {
        id: Date.now(),
        ...form,
        createdAt: new Date().toISOString(),
      };

      setCustomers((prev) => [newCustomer, ...prev]);
    }

    resetForm();
  };

  const handleEdit = (customer) => {
    setForm({
      name: customer.name,
      mobile: customer.mobile,
      address: customer.address,
    });

    setEditingId(customer.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    setCustomers((prev) =>
      prev.filter((customer) => customer.id !== id)
    );
  };

  const filteredCustomers = customers.filter((customer) => {
    const text = search.toLowerCase();

    return (
      customer.name.toLowerCase().includes(text) ||
      customer.mobile.includes(text) ||
      customer.address.toLowerCase().includes(text)
    );
  });

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Customers</h1>
          <p>Manage your Manish Tent House customers</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className="customer-toolbar">
        <div className="customer-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="customer-count">
          <Users size={17} />
          {customers.length} Customers
        </div>
      </div>

      <div className="customer-panel">
        {filteredCustomers.length === 0 ? (
          <div className="customer-empty">
            <div className="empty-circle">
              <Users size={28} />
            </div>

            <h3>
              {search ? "No customers found" : "No customers yet"}
            </h3>

            <p>
              {search
                ? "Try another name or mobile number."
                : "Add your first customer to get started."}
            </p>

            {!search && (
              <button
                className="secondary-button"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} />
                Add Customer
              </button>
            )}
          </div>
        ) : (
          <div className="customer-table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Mobile</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-name">
                        <div className="customer-avatar">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>

                        <strong>{customer.name}</strong>
                      </div>
                    </td>

                    <td>{customer.mobile}</td>

                    <td>
                      {customer.address || "—"}
                    </td>

                    <td>
                      <div className="table-actions">
                        <button
                          className="icon-button edit"
                          onClick={() => handleEdit(customer)}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-button delete"
                          onClick={() =>
                            handleDelete(customer.id)
                          }
                          title="Delete"
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

      {showForm && (
        <div className="modal-overlay">
          <div className="customer-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingId ? "Edit Customer" : "Add Customer"}
                </h2>

                <p>
                  Save customer details for faster billing.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={resetForm}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer Name *</label>

                <input
                  type="text"
                  placeholder="Enter customer name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={form.mobile}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mobile: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Address</label>

                <textarea
                  placeholder="Enter customer address"
                  rows="3"
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingId
                    ? "Update Customer"
                    : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;