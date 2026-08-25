import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import NewBill from "./pages/NewBill";
import Bills from "./pages/Bills";
import Customers from "./pages/Customers";
import Stock from "./pages/Stock";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-bill" element={<NewBill />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}

export default App;