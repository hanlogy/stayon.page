import { PropsWithChildren, ReactNode } from 'react';
import { FlexCenter } from '@hanlogy/react-web-ui';
import clsx from 'clsx';
import { HomeIcon } from 'lucide-react';
import { LazyLink } from './LazyLink';
import { LogoIcon } from './icons';

export function Layout({
  leading = 'home',
  title,
  trailing,
  children,
  bottom,
  withFooter = true,
}: PropsWithChildren<{
  leading?: 'logo' | 'home' | undefined;
  title?: ReactNode;
  trailing?: ReactNode;
  bottom?: ReactNode;
  withFooter?: boolean;
}>) {
  return (
    <>
      <header
        className={clsx(
          'fixed top-0 right-0 left-0 z-50',
          'h-14 px-4 md:h-18 md:px-6',
          'bg-white',
          'grid grid-cols-[1fr_auto_1fr] items-center'
        )}
      >
        <div className="justify-self-start">
          {leading && (
            <LazyLink href="/" className="flex items-center">
              {leading === 'logo' && (
                <>
                  <LogoIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                  <div className="text-lg font-medium sm:text-xl">StayOn</div>
                </>
              )}
              {leading === 'home' && (
                <FlexCenter className="-ml-2 h-10 w-10 rounded-full hover:bg-gray-100">
                  <HomeIcon className="w-5" />
                </FlexCenter>
              )}
            </LazyLink>
          )}
        </div>
        <div>{title && <div>{title}</div>}</div>
        <div className="justify-self-end">{trailing}</div>
      </header>

      <div className="h-14 md:h-18"></div>

      <main className="flex-1">{children}</main>
      {withFooter && (
        <footer className="px-4 md:px-6">
          {bottom}
          <div className="my-6 text-center text-sm text-gray-400">
            © 2026 stayon.page
          </div>
        </footer>
      )}
    </>
  );
}
