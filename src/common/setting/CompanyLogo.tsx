import { useCompany } from "@/context/CompanyContext";
import { url_api } from "@/main";

function LogoCompany() {
  const { company } = useCompany();

  return (
    <div className="flex justify-center items-center bg-white rounded-full w-[6%] px-4 py-4 absolute top-8 right-12">
      <img
        src={
          company?.logoCompany
            ? `${url_api}files/${encodeURIComponent(
                company?.logoCompany ?? ""
              )}`
            : undefined
        }
        alt="image"
      />
    </div>
  );
}

export default LogoCompany;
