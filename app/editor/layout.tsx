import { HomeIcon } from 'lucide-react';
import { Appbar } from '@/component/Appbar';
import { LazyLink } from '@/component/LazyLink';
import { PageTitle } from './components/PageTitle';

export default function EditorLayout({ children }: LayoutProps<'/editor'>) {
  return (
    <>
      <Appbar>
        <LazyLink
          href="/"
          replace
          className="fixed ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <HomeIcon className="w-5" />
        </LazyLink>
        <div className="w-full text-center text-xl font-medium text-gray-600">
          <PageTitle />
        </div>
      </Appbar>

      <main className="flex-1">{children}</main>
    </>
  );
}
