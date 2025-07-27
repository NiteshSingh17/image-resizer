import { TanstackProvider } from "./tanstackProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TanstackProvider>{children}</TanstackProvider>
    </>
  );
};