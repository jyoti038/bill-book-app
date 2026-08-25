import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Package,
  PlusCircle,
  MinusCircle,
} from "lucide-react";

function Stock() {
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem("mth_stock") || "[]");
  });

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    mrp: "",
    rate: "",
    quantity: "",
    lowStock: "5",
  });

  useEffect(() => {
    localStorage.setItem("mth_stock", JSON.stringify(items));
  }, [items]);

  const resetForm = () => {
    setForm({
      name: "",
      category: "",
      mrp: "",
      rate: "",
      quantity: "",
      lowStock: "5",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter item name.");
      return;
    }

    if (!form.category.trim()) {
      alert("Please enter category.");
      return;
    }

    if (form.rate === "" || Number(form.rate) < 0) {
      alert("Please enter a valid rate.");
      return;
    }

    if (form.quantity === "" || Number(form.quantity) < 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    const itemData = {
      name: form.name.trim(),
      category: form.category.trim(),
      mrp: Number(form.mrp) || 0,
      rate: Number(form.rate),
      quantity: Number(form.quantity),
      lowStock: Number(form.lowStock) || 5,
    };

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...itemData,
              }
            : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(),
        ...itemData,
        createdAt: new Date().toISOString(),
      };

      setItems((prev) => [newItem, ...prev]);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      category: item.category,
      mrp: item.mrp,
      rate: item.rate,
      quantity: item.quantity,
      lowStock: item.lowStock,
    });

    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const changeQuantity = (id, amount) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const newQuantity = Math.max(
          0,
          item.quantity + amount
        );

        return {
          ...item,
          quantity: newQuantity,
        };
      })
    );
  };

  const filteredItems = items.filter((item) => {
    const text = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(text) ||
      item.category.toLowerCase().includes(text)
    );
  });

  const totalItems = items.length;

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const lowStockCount = items.filter(
    (item) => item.quantity <= item.lowStock
  ).length;

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Stock</h1>
          <p>Manage your Manish Tent House inventory</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <div className="stock-summary">
        <div className="stock-summary-card">
          <Package size={20} />
          <div>
            <span>Total Items</span>
            <strong>{totalItems}</strong>
          </div>
        </div>

        <div className="stock-summary-card">
          <Package size={20} />
          <div>
            <span>Total Quantity</span>
            <strong>{totalQuantity}</strong>
          </div>
        </div>

        <div className="stock-summary-card warning">
          <Package size={20} />
          <div>
            <span>Low Stock</span>
            <strong>{lowStockCount}</strong>
          </div>
        </div>
      </div>

      <div className="stock-toolbar">
        <div className="stock-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search items or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="stock-count">
          {items.length} items
        </span>
      </div>

      <div className="stock-panel">
        {filteredItems.length === 0 ? (
          <div className="stock-empty">
            <div className="empty-circle">
              <Package size={28} />
            </div>

            <h3>
              {search
                ? "No items found"
                : "No stock added yet"}
            </h3>

            <p>
              {search
                ? "Try another search."
                : "Add your first inventory item."}
            </p>

            {!search && (
              <button
                className="secondary-button"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} />
                Add Item
              </button>
            )}
          </div>
        ) : (
          <div className="stock-table-wrapper">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>MRP</th>
                  <th>Rate</th>
                  <th>Available</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredItems.map((item) => {
                  const isLow =
                    item.quantity <= item.lowStock;

                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="stock-item-name">
                          <div className="stock-item-icon">
                            <Package size={16} />
                          </div>

                          <strong>{item.name}</strong>
                        </div>
                      </td>

                      <td>{item.category}</td>

                      <td>₹{item.mrp.toLocaleString("en-IN")}</td>

                      <td>
                        <strong>
                          ₹{item.rate.toLocaleString("en-IN")}
                        </strong>
                      </td>

                      <td>
                        <div className="quantity-control">
                          <button
                            onClick={() =>
                              changeQuantity(item.id, -1)
                            }
                            disabled={item.quantity === 0}
                          >
                            <MinusCircle size={17} />
                          </button>

                          <strong>{item.quantity}</strong>

                          <button
                            onClick={() =>
                              changeQuantity(item.id, 1)
                            }
                          >
                            <PlusCircle size={17} />
                          </button>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`stock-status ${
                            isLow ? "low" : "available"
                          }`}
                        >
                          {isLow ? "Low Stock" : "Available"}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          <button
                            className="icon-button edit"
                            onClick={() => handleEdit(item)}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="icon-button delete"
                            onClick={() =>
                              handleDelete(item.id)
                            }
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="stock-modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingId ? "Edit Item" : "Add Stock Item"}
                </h2>

                <p>
                  Add inventory details for your business.
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
                <label>Item Name *</label>

                <input
                  type="text"
                  placeholder="e.g. Plastic Chair"
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
                <label>Category *</label>

                <input
                  type="text"
                  placeholder="e.g. Chairs"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>MRP</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.mrp}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mrp: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Rate *</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.rate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        rate: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Available Quantity *</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        quantity: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Low Stock Alert</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="5"
                    value={form.lowStock}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        lowStock: e.target.value,
                      })
                    }
                  />
                </div>
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
                  {editingId ? "Update Item" : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stock;