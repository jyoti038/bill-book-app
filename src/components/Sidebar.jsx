import {
  LayoutDashboard,
  Receipt,
  FileText,
  Users,
  Package,
  Settings,
  X,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    name: "Create Bill",
    icon: Receipt,
    path: "/new-bill",
  },
  {
    name: "Bills",
    icon: FileText,
    path: "/bills",
  },
  {
    name: "Customers",
    icon: Users,
    path: "/customers",
  },
  {
    name: "Stock",
    icon: Package,
    path: "/stock",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

function Sidebar({ mobileOpen, setMobileOpen }) {
  const currentPath = window.location.pathname;

  const closeSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`sidebar ${
          mobileOpen ? "mobile-show" : ""
        }`}
      >
        {/* SIDEBAR HEADER */}

        <div className="sidebar-header">
          <div className="brand-logo">MT</div>

          <div className="brand-name">
            <h2>Manish Tent</h2>
            <span>House</span>
          </div>

          {/* Mobile close button */}

          <button
            type="button"
            className="close-sidebar"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="business-label">
          BUSINESS
        </div>

        {/* MENU */}

        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.path === "/"
                ? currentPath === "/"
                : currentPath.startsWith(item.path);

            return (
              <a
                key={item.name}
                href={item.path}
                className={`nav-item ${
                  active ? "active" : ""
                }`}
                onClick={closeSidebar}
              >
                <Icon size={19} />

                <span>{item.name}</span>
              </a>
            );
          })}
        </nav>

        {/* BOTTOM PROFILE */}

        <div className="sidebar-bottom">
          <div className="user-box">
            <div className="user-avatar">M</div>

            <div>
              <strong>
                Manish Tent House
              </strong>

              <small>
                Administrator
              </small>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;