import { Menu, Bell, Search } from "lucide-react";

function Header({ setMobileOpen }) {
  return (
    <header className="header">
      <button
        className="menu-button"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={22} />
      </button>

      <div className="header-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search bills, customers, items..."
        />
      </div>

      <div className="header-right">
        <button className="notification">
          <Bell size={19} />
          <span />
        </button>

        <div className="profile">
          <div className="profile-avatar">M</div>

          <div className="profile-info">
            <strong>Manish</strong>
            <small>Admin</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;