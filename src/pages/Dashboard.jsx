import {
  IndianRupee,
  Receipt,
  Users,
  Package,
  Plus,
} from "lucide-react";

function Dashboard() {
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to Manish Tent House</p>
        </div>

        <a href="/new-bill" className="primary-button">
          <Plus size={18} />
          Create New Bill
        </a>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <IndianRupee />
          <div>
            <span>Total Sales</span>
            <h3>₹0</h3>
            <small>This month</small>
          </div>
        </div>

        <div className="stat-card">
          <Receipt />
          <div>
            <span>Total Bills</span>
            <h3>0</h3>
            <small>This month</small>
          </div>
        </div>

        <div className="stat-card">
          <Users />
          <div>
            <span>Customers</span>
            <h3>0</h3>
            <small>Total customers</small>
          </div>
        </div>

        <div className="stat-card">
          <Package />
          <div>
            <span>Available Stock</span>
            <h3>0</h3>
            <small>Items available</small>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Recent Bills</h2>
              <p>Your latest generated bills</p>
            </div>

            <a href="/bills">View All →</a>
          </div>

          <div className="empty-state">
            <Receipt size={35} />

            <h3>No bills yet</h3>

            <p>
              Your generated bills will appear here.
            </p>

            <a href="/new-bill" className="secondary-button">
              Create First Bill
            </a>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Stock Overview</h2>
              <p>Current inventory</p>
            </div>

            <a href="/stock">Manage →</a>
          </div>

          <div className="empty-state">
            <Package size={35} />

            <h3>No stock added</h3>

            <p>Add your tent house items.</p>

            <a href="/stock" className="secondary-button">
              Add Stock
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

export default Dashboard;