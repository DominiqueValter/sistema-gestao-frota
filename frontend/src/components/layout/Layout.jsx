import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          background: "#f5f7fb",
        }}
      >
        <Header />

        {/* Conteúdo */}
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
