import { useState } from "react";
import { PWVMSLayout } from "@/components/pwvms/PWVMSLayout";
import { Dashboard } from "@/components/pwvms/Dashboard";
import { ProjectMaster } from "@/components/pwvms/ProjectMaster";
import { VendorMaster } from "@/components/pwvms/VendorMaster";
import { InvoiceManagement } from "@/components/pwvms/InvoiceManagement";
import { PaymentManagement } from "@/components/pwvms/PaymentManagement";
import { CustomerPayments } from "@/components/pwvms/CustomerPayments";
import { AgeingDashboard } from "@/components/pwvms/AgeingDashboard";
import { Reports } from "@/components/pwvms/Reports";
import { Settings } from "@/components/pwvms/Settings";

const PWVMS = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveView} />;
      case "projects":
        return <ProjectMaster />;
      case "vendors":
        return <VendorMaster />;
      case "invoices":
        return <InvoiceManagement />;
      case "payments":
        return <PaymentManagement />;
      case "customer-payments":
        return <CustomerPayments />;
      case "ageing":
        return <AgeingDashboard />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <PWVMSLayout activeMenu={activeView} onNavigate={setActiveView}>
      {renderContent()}
    </PWVMSLayout>
  );
};

export default PWVMS;
