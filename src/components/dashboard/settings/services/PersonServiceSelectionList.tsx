import { Button } from "@/components/ui/button";
import { UseFormSetValue } from "react-hook-form";
import { IoPerson } from "react-icons/io5";

export default function PersonServiceSelectionList({
  listToWatch,
  setValue,
  personList,
  personType,
}: {
  listToWatch: string[] | null;
  setValue: UseFormSetValue<{
    operators: string[];
    administrators: string[];
    serviceName: string;
  }>;
  personList: { value: string; label: string }[] | null;
  personType: "operators" | "administrators";
}) {
  const personLabel =
    personType === "operators" ? "opérateur" : "administrateur";

  if (listToWatch === null || personList === null) {
    return null;
  }

  return (
    <div
      className={`mb-4 p-4 bg-popover rounded-md h-30 flex flex-col ${
        listToWatch.length > 1 ? "overflow-y-auto" : ""
      }
          ${listToWatch.length === 0 ? "justify-center items-center" : ""}
          `}
    >
      {listToWatch.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">
          Aucun {personLabel}.
        </p>
      ) : (
        <>
          {listToWatch.map((personId, index) => {
            const person = personList.find(
              (manager) => manager.value === personId
            );
            return (
              <div
                key={personId}
                className={`flex items-center justify-between w-full ${
                  index === listToWatch.length - 1 ? "pb-0" : "border-b"
                } ${index === 0 ? "pb-4" : "py-4"}
                    ${
                      index === listToWatch.length - 1 && index === 0
                        ? "pb-0!"
                        : ""
                    }
                    `}
              >
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 mr-2 bg-primary rounded-full flex items-center justify-center">
                    <IoPerson color="white" fontSize={14} />
                  </div>
                  <span>{person ? `${person.label}` : personId}</span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newPersons = listToWatch.filter(
                      (id) => id !== personId
                    );
                    setValue(`${personType}`, newPersons, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                >
                  ✕
                </Button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
