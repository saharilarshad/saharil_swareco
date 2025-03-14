import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type TOptions = {
  day: any;
  month: any;
  year: any;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString:any) {
  const options = { day: "numeric", month: "long", year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options as TOptions);
}
