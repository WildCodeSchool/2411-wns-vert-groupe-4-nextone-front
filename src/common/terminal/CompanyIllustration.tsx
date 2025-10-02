import company from "../../assets/company.png";
import logoWhite from "../../assets/nextone-white.png";

function CompanyIllustration() {
  return (
    <div className="hidden md:flex w-full md:w-1/2 h-screen p-8">
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <img src={company} alt="image-entreprise" className="w-full h-full object-cover"/>
        <span className="absolute bottom-2 right-2 px-2 py-1 rounded flex items-center gap-2 text-white">
          <img src={logoWhite} alt="logo NextOne" className="w-8 h-10 md:w-9 md:h-11"/>
          <div className="text-left">
            <p className="text-[8px] md:text-[10px] leading-none">Powered by</p>
            <p className="font-semibold text-[20px] md:text-[24px] leading-none">
              NextOne
            </p>
          </div>
        </span>
      </div>
    </div>
  );
}

export default CompanyIllustration;
