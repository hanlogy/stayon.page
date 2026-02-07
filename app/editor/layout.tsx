import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { Appbar } from '@/component/Appbar';

export default function EditorLayout({ children }: LayoutProps<'/editor'>) {
  return (
    <>
      <Appbar>
        <Link href="/" replace className="p-2">
          <ChevronLeftIcon />
        </Link>
      </Appbar>
      <div className="mx-auto max-w-2xl">
        {children}
        <div></div>
      </div>
    </>
  );
}
