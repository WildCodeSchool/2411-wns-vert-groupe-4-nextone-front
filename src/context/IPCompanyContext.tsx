import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  useEffect,
} from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_COMPANY_BY_IP } from "@/requests/queries/company.query";
import type { Company, IPCompanyContextType } from "@/types/terminal";

const IPCompanyContext = createContext({} as IPCompanyContextType);

// eslint-disable-next-line react-refresh/only-export-components
export const useIPCompany = () => useContext(IPCompanyContext);

export const IPCompanyProvider = ({ children }: PropsWithChildren) => {
  const [company, setCompany] = useState<Company | null>(() => {
    const stored = localStorage.getItem("ipCompanyData");
    return stored ? JSON.parse(stored) : null;
  });

  const [fetchCompany, { loading, error }] = useLazyQuery(GET_COMPANY_BY_IP, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      if (!data?.companyByIP) {
        console.error("❌ No company returned for this IP");
        return;
      }

      console.log("✅ Company loaded from IP:", data.companyByIP.name);
      setCompany(data.companyByIP);
      localStorage.setItem("ipCompanyData", JSON.stringify(data.companyByIP));
    },
    onError(error) {
      console.error("❌ Error loading company by IP:", error);
      setCompany(null);
      localStorage.removeItem("ipCompanyData");
    },
  });

  useEffect(() => {
    console.log("🔄 IPCompanyContext: Fetching company...");
    fetchCompany();
  }, [fetchCompany]);

  const refetch = () => {
    console.log("🔄 Manual refetch company by IP");
    fetchCompany();
  };

  const value: IPCompanyContextType = {
    company,
    loading,
    error,
    refetch,
  };

  return (
    <IPCompanyContext.Provider value={value}>
      {children}
    </IPCompanyContext.Provider>
  );
};
