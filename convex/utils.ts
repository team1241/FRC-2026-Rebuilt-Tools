import { formatISO } from "date-fns"

export const getFormattedTimestamp = () => {
  return formatISO(new Date())
}