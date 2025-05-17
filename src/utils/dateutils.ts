import { format } from "date-fns";

const formateDate = (date: any, formate?: string) => {
  if (!date) return ""; // <-- si date es falsy, regresa vacío

  // Soportar string numérico, Date, o timestamp
  let dateObj;
  try {
    dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return ""; // <-- si no es fecha válida
  } catch {
    return "";
  }

  const dateFormat = formate || "MM/dd/yyyy";
  try {
    return format(dateObj, dateFormat);
  } catch {
    return ""; // <-- si falla el formateo
  }
};

export { formateDate };
