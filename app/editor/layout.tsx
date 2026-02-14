import { ChevronLeftIcon } from 'lucide-react';
import { Appbar } from '@/component/Appbar';
import { LazyLink } from '@/component/LazyLink';
import { FilledButton } from '@/component/buttons';
import { PageTitle } from './components/PageTitle';
import { formId } from './constants';

export default function EditorLayout({ children }: LayoutProps<'/editor'>) {
  return (
    <>
      <Appbar>
        <LazyLink
          href="/"
          replace
          className="fixed ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ChevronLeftIcon />
        </LazyLink>
        <div className="w-full text-center text-xl font-medium text-gray-600">
          <PageTitle />
        </div>
      </Appbar>

      <main className="flex-1">{children}</main>

      <div className="h-22 sm:h-30"></div>
      <div className="fixed right-0 bottom-0 left-0 flex h-22 items-center justify-center sm:h-30">
        <FilledButton
          type="submit"
          size="medium"
          form={formId}
          className="min-w-50"
        >
          Publish
        </FilledButton>
      </div>
    </>
  );
}
