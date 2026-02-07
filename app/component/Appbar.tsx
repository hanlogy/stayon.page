import { PropsWithChildren } from 'react';

export function Appbar({ children }: PropsWithChildren) {
  return (
    <>
      <header className="fixed top-0 right-0 left-0 flex h-14 items-center justify-between bg-white px-4">
        {children}
      </header>
      <div className="h-14"></div>
    </>
  );
}
