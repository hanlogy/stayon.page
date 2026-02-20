import { useState, SubmitEvent, PropsWithChildren } from 'react';
import {
  clsx,
  FlexCenter,
  FormDataConstraint,
  FormManager,
} from '@hanlogy/react-web-ui';
import { FilledButton } from '@/component/buttons';
import { ActionResponse, ShareableCommon } from '@/definitions/types';
import { formId } from '../constants';
import { useEditorContext } from '../state/hooks';
import { SettingsFormData } from '../types';
import { DeleteEntity } from './DeleteEntity/DeleteEntity';
import { EditorTabs } from './EditorTabs';
import { FeatureSettings } from './FeatureSettings';

export function EditorForm<
  T extends FormDataConstraint<T>,
  InitialValuesT extends ShareableCommon,
>({
  className,
  children,
  action,
  formManager,
  initialValues,
}: PropsWithChildren<{
  className?: string;
  action: (
    shortId: string | undefined,
    formData: Partial<T & SettingsFormData>
  ) => ActionResponse | Promise<ActionResponse>;
  formManager: FormManager<T & SettingsFormData>;
  initialValues: InitialValuesT | undefined;
}>) {
  const { tabName } = useEditorContext();
  const { validate, register } = formManager;
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!initialValues;

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setError(null);
    setIsPending(true);
    const { ok, error } = await action(
      initialValues?.shortId,
      formManager.getValues()
    );

    if (!ok) {
      setError(error?.message ?? 'Something is wrong');
    }
    setIsPending(false);
  };

  return (
    <div className={className}>
      <FlexCenter className="mt-8 mb-8">
        <EditorTabs />
      </FlexCenter>
      <form autoComplete="off" id={formId} onSubmit={onSubmit}>
        <div>
          <div className={clsx('contents', { hidden: tabName !== 'settings' })}>
            <FeatureSettings
              initialValues={initialValues}
              register={register}
            />
          </div>
          <div className={clsx('contents', { hidden: tabName !== 'detail' })}>
            {children}
          </div>
        </div>
      </form>
      <div className="p-4 text-center text-red-600">{error}</div>

      <div className="h-22 sm:h-30"></div>
      <div className="fixed right-0 bottom-0 left-0 flex h-22 items-center justify-center space-x-4 sm:h-30">
        <FilledButton
          disabled={isPending}
          type="submit"
          size="medium"
          form={formId}
          className="min-w-50"
        >
          {isEdit ? 'Save' : 'Publish'}
        </FilledButton>

        {initialValues?.shortId && (
          <DeleteEntity shortId={initialValues.shortId} />
        )}
      </div>
    </div>
  );
}
