import { format, parseISO, isValid } from "date-fns";

export const formatDateToServer = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

export const parseServerDateToLocalDate = (yyyyMMdd: string): Date => {
  const parsed = parseISO(yyyyMMdd);
  if (!isValid(parsed)) {
    throw new Error(`Invalid date string: ${yyyyMMdd}`);
  }
  return parsed;
};
