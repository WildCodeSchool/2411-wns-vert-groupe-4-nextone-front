import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

function NavigationActions({ onBack, onNext}: StepControlsProps) {
    const navigate = useNavigate()

    return (
        <div className="flex max-w-md mt-6 space-x-9">
            <Button onClick={() => navigate(onBack)} variant="ghost" className="text-primary text-[20px]">Retour</Button>
            <Button onClick={() => navigate(onNext)} className="text-[20px]">Continuer</Button>
        </div>
    )
}

export default NavigationActions;