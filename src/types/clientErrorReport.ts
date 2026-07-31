export type ClientErrorReport = {
  source:
    | "window-error"
    | "unhandled-rejection"
    | "react-error"
    | "manual";

  name: string;
  message: string;
  stack: string | null;
  pathname: string;
  timestamp: string;
};