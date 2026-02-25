'use client';

import { useMemo } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import type { Poll } from '@/definitions/types';
import { EditorLayout } from '@/editor/components/EditorLayout';
import { EntityNameField } from '@/editor/components/EntityNameField';
import { PollFormData, publishPoll } from './actions';

export function PollEditor({ initialData }: { initialData?: Poll }) {
  const formManager = useForm<PollFormData>();

  const defaultValues = useMemo(() => {
    if (!initialData) {
      return {};
    }
    const { name } = initialData;

    return {
      name,
    };
  }, [initialData]);

  const { register } = formManager;

  return (
    <EditorLayout
      nameForTitle="poll"
      className="mx-auto max-w-2xl space-y-4"
      initialData={initialData}
      action={publishPoll}
      formManager={formManager}
    >
      <div className="space-y-6">
        <EntityNameField
          label="Poll name"
          register={register}
          defaultValue={defaultValues.name}
        />
      </div>
    </EditorLayout>
  );
}
