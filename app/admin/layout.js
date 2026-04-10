import { Inter } from "next/font/google";
import { DashboardTopNav, MobileDashNav, SideNavAdmin } from "@/components";
import AdminAuthWrapper from "@/components/AdminAuthWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin | Oga Landlord",
  description: "Oga Landlord Admin Dashboard",
};

export default function AdminLayout({ children }) {
  return (
    <AdminAuthWrapper>
      <div className={`dashboard ${inter.className}`}>
        <div className="top-nav">
          <DashboardTopNav />
        </div>
        <div className="dashboard-body">
          <div className="side-nav-cont">
            <SideNavAdmin />
          </div>
          <MobileDashNav />
          <div className="dashboard-page">{children}</div>
        </div>
      </div>
    </AdminAuthWrapper>
  );
}
