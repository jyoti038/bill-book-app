import { useEffect, useState } from "react";
import {
  Users,
  Package,
  Receipt,
  IndianRupee,
  TrendingUp,
  Clock,
} from "lucide-react";

function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [stock, setStock] = useState([]);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    loadDashboardData();

    // Agar kisi page se localStorage update ho
    const handleStorage = () => {
      loadDashboardData();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const loadDashboardData = () => {
    setCustomers(
      JSON.parse(
        localStorage.getItem("mth_customers") || "[]"
      )
    );

    setStock(
      JSON.parse(
        localStorage.getItem("mth_stock") || "[]"
      )
    );

    setBills(
      JSON.parse(
        localStorage.getItem("mth_bills") || "[]"
      )
    );
  };

  const money = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  // Total stock quantity
  const totalStock = stock.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  // Total sales
  const totalSales = bills.reduce(
    (sum, bill) => sum + Number(bill.grandTotal || 0),
    0
  );

  // Total pending
  const totalPending = bills.reduce(
    (sum, bill) => sum + Number(bill.balance || 0),
    0
  );

  // Today's bills
  const today = new Date().toDateString();

  const todayBills = bills.filter(
    (bill) =>
      new Date(bill.date).toDateString() === today
  );

  const todaySales = todayBills.reduce(
    (sum, bill) => sum + Number(bill.grandTotal || 0),
    0
  );

  // Low stock
  const lowStock = stock.filter(
    (item) => Number(item.quantity || 0) <= 5
  );

  return (
    <div>
      {/* HEADER */}

      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back to Manish Tent House.
          </p>
        </div>
      </div>

      {/* STATS */}

      <div className="dashboard-stats">

        <div className="dashboard-stat-card">
          <div className="stat-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Total Customers</span>
            <h2>{customers.length}</h2>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">
            <Package size={20} />
          </div>

          <div>
            <span>Total Stock</span>
            <h2>{totalStock}</h2>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">
            <Receipt size={20} />
          </div>

          <div>
            <span>Total Bills</span>
            <h2>{bills.length}</h2>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">
            <IndianRupee size={20} />
          </div>

          <div>
            <span>Total Sales</span>
            <h2>{money(totalSales)}</h2>
          </div>
        </div>

      </div>

      {/* TODAY */}

      <div className="dashboard-grid">

        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Today's Overview</h2>
              <p>Business summary for today.</p>
            </div>

            <TrendingUp size={19} />
          </div>

          <div className="overview-list">

            <div className="overview-row">
              <span>Today's Bills</span>
              <strong>{todayBills.length}</strong>
            </div>

            <div className="overview-row">
              <span>Today's Sales</span>
              <strong>{money(todaySales)}</strong>
            </div>

            <div className="overview-row">
              <span>Pending Amount</span>
              <strong className="pending-text">
                {money(totalPending)}
              </strong>
            </div>

          </div>
        </div>

        {/* LOW STOCK */}

        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Low Stock</h2>
              <p>Items that need attention.</p>
            </div>

            <Package size={19} />
          </div>

          {lowStock.length === 0 ? (
            <div className="dashboard-empty">
              <Package size={25} />
              <p>All stock levels are healthy.</p>
            </div>
          ) : (
            <div className="low-stock-list">
              {lowStock.slice(0, 5).map((item) => (
                <div
                  className="low-stock-row"
                  key={item.id}
                >
                  <div>
                    <strong>{item.name}</strong>
                    <small>
                      {item.category || "General"}
                    </small>
                  </div>

                  <span>
                    {item.quantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* RECENT BILLS */}

      <div className="dashboard-panel recent-bills-panel">

        <div className="dashboard-panel-header">
          <div>
            <h2>Recent Bills</h2>
            <p>Latest generated bills.</p>
          </div>

          <Receipt size={19} />
        </div>

        {bills.length === 0 ? (
          <div className="dashboard-empty">
            <Receipt size={25} />
            <p>No bills generated yet.</p>
          </div>
        ) : (
          <div className="recent-bills-list">

            {bills.slice(0, 5).map((bill) => (
              <div
                className="recent-bill-row"
                key={bill.id}
              >
                <div className="recent-bill-info">
                  <div className="recent-bill-icon">
                    <Receipt size={16} />
                  </div>

                  <div>
                    <strong>
                      {bill.billNumber}
                    </strong>

                    <small>
                      {bill.customer?.name}
                    </small>
                  </div>
                </div>

                <div className="recent-bill-amount">
                  <strong>
                    {money(bill.grandTotal)}
                  </strong>

                  <small>
                    {new Date(
                      bill.date
                    ).toLocaleDateString("en-IN")}
                  </small>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;