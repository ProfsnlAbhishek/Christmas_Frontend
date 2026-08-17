// src/utils/formatting.ts
export function formatSSN(ssn: string): string {
  const digitsOnly = ssn.replace(/\D/g, "").slice(0, 9); // 9 digits
  // progressively insert dashes
  return digitsOnly
    .replace(/^(\d{3})(\d)/, "$1-$2")
    .replace(/^(\d{3}-\d{2})(\d)/, "$1-$2");
}

export function formatPhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "").slice(0, 10); // 10 digits
  // format as ###-###-####
  return digitsOnly
    .replace(/^(\d{3})(\d)/, "$1-$2")
    .replace(/^(\d{3}-\d{3})(\d)/, "$1-$2");
}

export function checkFormatSSN(ssn: string): boolean {
  return /^\d{3}-\d{2}-\d{4}$/.test(ssn);
}

export function checkFormatPhone(phone: string): boolean {
  return /^\d{3}-\d{3}-\d{4}$/.test(phone);
}

// Optional helpers
export function formatBackendDate(eDate: string): string {
  // from "YYYY-MM-DD" -> "MM/DD/YYYY"
  const [y, m, d] = eDate.split("-");
  return `${m}/${d}/${y}`;
}

export function formatZip(zip: string): string {
  return zip.replace(/\D/g, "").slice(0, 5); // keep 5 digits
}

export function toUpperStr(value: string): string {
  return value.toUpperCase();
}

export function toSqlDateTime(dtLocal: string): string {
  if (!dtLocal) return "";

  const base = dtLocal.replace("T", " ");
  return base.length === 16 ? `${base}:00` : base;
}

export function formatBackDateTime(value: string): string {
  if (!value) return "";

  const dtSplit = value.split(" ");

  const dt = formatBackendDate(dtSplit[0]);

  const [hrs, min] = dtSplit[1].split(":");

  let amOrPm = "AM";

  let tm = "";
  let hrString = "";
  let hours:number = Number(hrs);


  if (Number(hrs) >= 12 && Number(hrs) < 24) {
    amOrPm = "PM";
    hours = Number(hrs) > 12 ? Number(hrs) - 12 : Number(hrs);

  }

   if (hours < 10) {
      hrString = "0" + hours.toString();
    } else if (hours === 24) {
      hrString = "00";
      amOrPm = "AM";
    } else {
      hrString = hours.toString();
    }

  tm = hrString + ":" + min + " " + amOrPm;

  return dt + " " + tm;
}



export const parseDate = (value: any) => {
  if (!value) return null;
  return value instanceof Date ? value : new Date(value);
};
