import logo from "../../assets/images/Logo_NextOne_vert-noir.png";

function TvFooter() {
    return(
        <div className="flex items-center justify-center text-black bg-white gap-3 mt-4 p-3 shadow">
            <img src={logo} alt="Logo" className="w-[70px] h-[70px] rounded-lg" />
            <p className="text-xl font-medium">
                Veuillez patienter,<br /> votre numéro sera appelé prochainement.
            </p>
        </div>
    )
}

export default TvFooter;