import company from "../../assets/company.png";
import logoWhite from "../../assets/nextone-white.png"

function CompanyIllustration() {
  return (
    <div className="hidden p-4 md:flex w-full md:w-1/2 bg-white items-start justify-center mt-4 md:mt-[10px]">
      <div className="relative max-h-[90%] w-full md:w-auto rounded-lg overflow-hidden">
        <img src={company} alt="image-entreprise" className="w-full h-auto object-cover" style={{ aspectRatio: "4 / 5" }}/>
        <span className="absolute bottom-2 right-2 px-2 py-1 rounded flex items-center gap-2 text-white">
          <img src={logoWhite} alt="logo NextOne" className="w-8 h-10 md:w-9 md:h-11" />
          <div>
            <p className="text-[8px] md:text-[10px] leading-none">Powered by</p>
            <p className="font-semibold text-[20px] md:text-[24px] leading-none">NextOne</p>
          </div>
        </span>
      </div>
    </div>
  );
}


export default CompanyIllustration;
