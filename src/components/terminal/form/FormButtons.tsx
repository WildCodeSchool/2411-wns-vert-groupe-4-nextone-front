import * as React from "react";
import { Button } from "@/components/ui/button";

export type FormButtonsProps = {
  onBack: () => void;
  onCancel?: () => void;
  loading?: boolean;
  isLastStep?: boolean;
};

const FormButtons: React.FC<FormButtonsProps> = ({
  onBack,
  onCancel,
  loading,
  isLastStep,
}) => {
  return (
    <div className="flex w-full items-center justify-between mt-6">
      <div className="flex space-x-9">
        <Button
          type="button"
          onClick={onBack}
          variant="ghost"
          className="text-primary text-[17px] p-6"
          disabled={loading}
        >
          Retour
        </Button>

        <Button
          type="submit"
          className="text-[17px] p-6"
          disabled={loading}
          data-testid={isLastStep ? "submit-ticket-button" : "next-button"}
        >
          {loading ? "Envoi..." : isLastStep ? "Valider" : "Continuer"}
        </Button>
      </div>

      {onCancel && (
        <Button
          type="button"
          onClick={onCancel}
          variant="ghost"
          className="text-primary text-[17px] p-6"
          disabled={loading}
        >
          Revenir à l'accueil
        </Button>
      )}
    </div>
  );
};

export default FormButtons;
