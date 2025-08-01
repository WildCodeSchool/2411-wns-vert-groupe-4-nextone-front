import company from "../../assets/company.png";
import logoWhite from "../../assets/nextone-white.png"

function CompanyIllustration() {
    return (
        <div className="w-1/2 bg-white flex items-center justify-center p-4">
            <div className="relative max-h-[90%] w-auto rounded-lg overflow-hidden">
            <img src={company} alt="image-entreprise" className="h-full w-full object-cover" style={{ aspectRatio: "4 / 5" }}/>
            <span className="absolute bottom-2 right-2 px-2 py-1 rounded text-left w-max flex items-center gap-2 text-white">
                <img src={logoWhite} alt="logo NextOne" style={{ width: "31px", height: "42px", opacity: 1, transform: "rotate(0deg)"}}/>
                <div>
                    <p className="text-[10px] leading-none">Powered by</p>
                    <p className="font-semibold text-[24px] leading-none">NextOne</p>
                </div>
            </span>
            </div>
        </div>
    )
}

export default CompanyIllustration;