import logo from "../../assets/images/Logo_NextOne_vert-noir.png";

function TvFooter() {
  return (
    <div className="flex items-center justify-center text-black bg-white gap-3 mt-4 p-10 shadow">
      <img src={logo} alt="Logo" className="h-[7vh] rounded-lg mr-6" />
      <p className="text-3xl font-medium">
        Veuillez patienter, votre ticket sera appelé prochainement.
      </p>
    </div>
  );
}

export default TvFooter;
