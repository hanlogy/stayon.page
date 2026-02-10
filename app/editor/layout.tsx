'use client';

import { DialogProvider } from '@hanlogy/react-web-ui';
import { ChevronLeftIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Appbar } from '@/component/Appbar';
import { LazyLink } from '@/component/LazyLink';
import { FilledButton } from '@/component/buttons';

export default function EditorLayout({ children }: LayoutProps<'/editor'>) {
  const pathname = usePathname();
  const addonPath = pathname.replace(/^\/?editor\//, '').split('/')[0];
  const pageTitle = {
    checklist: 'Checklist',
    poll: 'Poll',
    event: 'Event',
    'time-slots': 'Time slots',
  }[addonPath];

  return (
    <DialogProvider>
      <Appbar>
        <LazyLink
          href="/"
          replace
          className="fixed flex h-10 w-10 items-center justify-center"
        >
          <ChevronLeftIcon />
        </LazyLink>
        <div className="w-full text-center text-xl font-medium text-gray-600">
          Create {pageTitle}
        </div>
      </Appbar>
      <div className="mx-auto w-full max-w-2xl flex-1 px-4">{children}</div>

      <>
        <div className="h-22 sm:h-30"></div>
        <div className="fixed right-0 bottom-0 left-0 flex h-22 items-center justify-center sm:h-30">
          <FilledButton size="medium" className="min-w-50">
            Publish
          </FilledButton>
        </div>
      </>
    </DialogProvider>
  );
}
