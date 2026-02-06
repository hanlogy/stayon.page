import { XIcon } from 'lucide-react';
import Link from 'next/link';

export default function EditorLayout({ children }: LayoutProps<'/editor'>) {
  return (
    <>
      <Link href="/" replace className="fixed top-2 right-2 p-2">
        <XIcon />
      </Link>
      <div className="mx-auto max-w-2xl">{children}</div>
    </>
  );
}
