import { useCompany } from "@/context/CompanyContext";

function LogoCompany() {
  const { company } = useCompany();
  const url_api = import.meta.env.VITE_ORIGIN_URL as string;

  if (!company || !company.logoCompany) {
    return null;
  }

  return (
    <div className="flex justify-center items-center bg-white rounded-full w-[6%] px-4 py-4 absolute top-8 right-12">
      <img
        src={`${url_api}/images/files/${encodeURIComponent(company?.logoCompany)}`}
        alt="image"
      />
    </div>
  );
}

export default LogoCompany;
