const defineServiceStatus = (
  ticketsQuantity: number,
  managersQuantity: number
): "Fluide" | "Chargé" | "Saturé" => {
  if (managersQuantity === 0 || !managersQuantity) {
    return "Saturé";
  }

  if (ticketsQuantity === 0 || !ticketsQuantity) {
    return "Fluide";
  }

  const ratio = ticketsQuantity / managersQuantity;

  if (ratio < 5) {
    return "Fluide";
  } else if (ratio >= 5 && ratio < 10) {
    return "Chargé";
  } else {
    return "Saturé";
  }
};

export default defineServiceStatus;
