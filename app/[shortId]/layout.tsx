import { DialogProvider } from '@hanlogy/react-web-ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: null,
  robots: { index: false, follow: false },
};

export default async function SharingLayout({
  children,
}: LayoutProps<'/[shortId]'>) {
  return <DialogProvider>{children}</DialogProvider>;
}
