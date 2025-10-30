import { IoPerson } from "react-icons/io5";

export default function PersonsServiceColumnComponent({
  persons,
  personType,
}: {
  persons: { firstName: string; lastName: string }[];
  personType: "member" | "administrator";
}) {
  const personLabel = personType === "member" ? "membre" : "administrateur";

  const personsNumber = persons.length;

  if (personsNumber === 0) {
    return `Aucun ${personLabel}`;
  }

  if (personsNumber <= 3) {
    return (
      <div className="flex flex-row gap-2 justify-start items-center">
        <div className="flex flex-row">
          {persons.slice(0, personsNumber).map((person, index) => (
            <div
              key={person.lastName + index}
              className={`w-8 h-8 bg-primary rounded-full border-1 border-popover flex items-center justify-center
                  ${index > 0 ? "-ml-3" : ""}
                  `}
            >
              <IoPerson color="white" fontSize={14} />
            </div>
          ))}
        </div>
        <p>
          {personsNumber === 1
            ? `${persons[0].firstName} ${persons[0].lastName}`
            : `${personsNumber} ${personLabel}s`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2 justify-start items-center">
      <div className="flex flex-row">
        {persons.slice(0, 3).map((person, index) => (
          <div
            key={person.lastName + index}
            className={`w-8 h-8 bg-primary rounded-full border-1 border-popover flex items-center justify-center
                  ${index > 0 ? "-ml-3" : ""}
                  `}
          >
            <IoPerson color="white" fontSize={14} />
          </div>
        ))}
      </div>
      <p>
        {personsNumber} {personLabel}s
      </p>
    </div>
  );
}
