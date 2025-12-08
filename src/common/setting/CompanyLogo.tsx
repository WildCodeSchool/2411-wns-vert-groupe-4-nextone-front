import { useCompany } from "@/context/CompanyContext";

function LogoCompany() {
    const { company } = useCompany();

    return (
        <>
            <img src={company?.logoCompany ? `http://localhost:4005/files/${encodeURIComponent(company?.logoCompany ?? "")}` : undefined } 
            alt="image" className="w-[180px] h-[90px] rounded-[50px] opacity-100 p-[15px_20px]"/>
        </>
    )
}

export default LogoCompany;