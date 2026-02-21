import { type ClassValue } from "./types";

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}
