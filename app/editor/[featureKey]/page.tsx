import { kebabToCamel } from '@hanlogy/ts-lib';
import { ChevronLeftIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Appbar } from '@/component/Appbar';
import { LazyLink } from '@/component/LazyLink';
import { FilledButton } from '@/component/buttons';
import { featureTypes } from '@/definitions/constants';
import { EditorClient } from './EditorClient';
import { formId } from './constants';

export default async function EditorPage({
  params,
}: PageProps<'/editor/[featureKey]'>) {
  const featureKey = (await params).featureKey;
  const featureType = featureTypes.find((e) => e === kebabToCamel(featureKey));

  if (!featureType) {
    return notFound();
  }

  const pageTitle = {
    checklist: 'Checklist',
    poll: 'Poll',
    event: 'Event',
    timeSlots: 'Time slots',
  }[featureType];

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
          Create {pageTitle}
        </div>
      </Appbar>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4">
        <EditorClient featureType={featureType} />
      </div>

      <>
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
    </>
  );
}
