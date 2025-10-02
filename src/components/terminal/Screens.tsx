import ChooseService from "./ChooseService";
import PersonnalInformation from "./PersonnalInformation";
import ContactInfo from "./ContactInformation";
import SuccessTicketPage from "./SuccessTicket";
import PhonePage from "../../pages/PhonePage";
import { Screen } from "../../types/terminal";

type ScreenComponentProps = {
    setCurrentScreen: (screen: Screen) => void;
    handleCancel: () => void;
    isScanned: boolean;
};

export function getScreenComponent(screen: Screen, props: ScreenComponentProps) {
    const { setCurrentScreen, handleCancel, isScanned } = props;

    if (screen === "chooseService") {
    return <ChooseService 
        onBack={handleCancel} 
        onNext={() => setCurrentScreen("persoInfo")} 
        onCancel={handleCancel}/>;
    } else if (screen === "persoInfo") {
    return <PersonnalInformation 
        onBack={() => setCurrentScreen("chooseService")} 
        onNext={() => setCurrentScreen("contactInfo")} 
        onCancel={handleCancel}/>;
    } else if (screen === "contactInfo") {
    return <ContactInfo 
        onBack={() => setCurrentScreen("persoInfo")} 
        onNext={() => setCurrentScreen("successTicketPage")} 
        onCancel={handleCancel}/>;
    } else if (screen === "successTicketPage") {
    return <SuccessTicketPage 
        isScanned={isScanned}  
        onTimeout={() => setCurrentScreen("phone")}/>;
    } else if (screen === "phone") {
    return <PhonePage/>;
    } else {
    return null;
    }
}
