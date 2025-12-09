import { useCompany } from "@/context/CompanyContext";
import { url_api } from "@/main";

function LogoCompany() {
    const { company } = useCompany();

    return (
        <>
            <img src={company?.logoCompany ? `${url_api}files/${encodeURIComponent(company?.logoCompany ?? "")}` : undefined } 
            alt="image" className="w-[180px] h-[90px] rounded-[50px] opacity-100 p-[15px_20px]"/>
        </>
    )
}

export default LogoCompany;