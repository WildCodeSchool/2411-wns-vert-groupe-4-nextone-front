import logoWhite from "../../assets/nextone-white.png";

function CompanyIllustration() {
  return (
    <div className="hidden md:flex w-full md:w-1/2 h-screen p-8">
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <img
          src="/login-picture.jpg"
          alt="image-entreprise"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-5 right-4 px-2 py-1 rounded flex items-center gap-4 text-white">
          <img src={logoWhite} alt="logo NextOne" className="h-10" />
          <div className="text-left flex flex-col leading-none">
            <p className="text-[8px] md:text-[10px] leading-none">Powered by</p>
            <p className="font-semibold text-[20px] md:text-[24px] leading-none">
              NextOne
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyIllustration;
