import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  useEffect,
} from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_COMPANY_INFORMATIONS } from "@/requests/queries/settings.query";
import { UPDATE_COMPANY_INFORMATIONS } from "@/requests/mutations/settings.mutation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type Company = {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  logoCompany?: string;
  siret: string;
  email: string;
};

type CompanyContextType = {
  company: Company | null;
  loading: boolean;
  error: any;
  getCompany(): Promise<void>;
  updateCompany(data: Partial<Company>): Promise<void>;
  reset(): void;
};

const CompanyContext = createContext({} as CompanyContextType);
const LOCAL_STORAGE_KEY = "companyData";

export const useCompany = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  const companyId = user?.companyId;
  const { toastSuccess, toastError } = useToast();

  const [company, setCompany] = useState<Company | null>(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [fetchCompany, { loading, error }] = useLazyQuery(
    GET_COMPANY_INFORMATIONS,
    {
      fetchPolicy: "no-cache",
      onCompleted(data) {
        if (!data?.company) return;

        setCompany(data.company);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.company));
      },
    }
  );

  const [updateCompanyMutation] = useMutation(UPDATE_COMPANY_INFORMATIONS, {
    fetchPolicy: "no-cache",
    onCompleted: (res) => {
      const updated = res?.updateCompany;
      if (!updated) return;
      setCompany(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      toastSuccess("Les informations ont bien été mises à jour.");
    },
    onError: () => {
      toastError("Erreur lors de la mise à jour des informations.");
    },
  });

  const getCompany = async () => {
    if (!companyId) return;
    await fetchCompany({
      variables: { companyId },
    });
  };

  const updateCompany = async (data: Partial<Company>) => {
    if (!companyId) return;
    await updateCompanyMutation({
      variables: { data: { id: companyId, ...data } },
    });
  };

  const reset = () => {
    setCompany(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  useEffect(() => {
    if (companyId) getCompany();
    else reset();
  }, [companyId]);

  const value: CompanyContextType = { company, loading, error, getCompany, updateCompany, reset };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};
