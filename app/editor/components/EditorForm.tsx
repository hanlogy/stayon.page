import { useState, SubmitEvent, ReactNode } from 'react';
import {
  clsx,
  FlexCenter,
  FormDataConstraint,
  FormManager,
} from '@hanlogy/react-web-ui';
import { FilledButton } from '@/component/buttons';
import { formId } from '../constants';
import { EditorTabName, SettingsFormData } from '../types';
import { EditorTabs } from './EditorTabs';
import { FeatureSettings } from './FeatureSettings';

export function EditorForm<T extends FormDataConstraint<T>>({
  children,
  action,
  formManager,
}: {
  children:
    | ReactNode
    | ((options: {
        setTabName: (tabName: EditorTabName) => void;
      }) => ReactNode);
  action: (formData: Partial<T & SettingsFormData>) => void | Promise<void>;
  formManager: FormManager<T & SettingsFormData>;
}) {
  const { validate, register } = formManager;
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabName, setTabName] = useState<EditorTabName>('detail');

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setError(null);

    try {
      setIsPending(true);
      await action(formManager.getValues());
    } catch {
      setError('Something is wrong');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <FlexCenter className="mt-8 mb-8">
        <EditorTabs tabName={tabName} onChange={setTabName} />
      </FlexCenter>
      <form autoComplete="off" id={formId} onSubmit={onSubmit}>
        <div>
          <div className={clsx('contents', { hidden: tabName !== 'settings' })}>
            <FeatureSettings register={register} />
          </div>
          <div className={clsx('contents', { hidden: tabName !== 'detail' })}>
            {typeof children === 'function'
              ? children({ setTabName })
              : children}
          </div>
        </div>
      </form>
      <div className="p-4 text-center text-red-600">{error}</div>

      <div className="h-22 sm:h-30"></div>
      <div className="fixed right-0 bottom-0 left-0 flex h-22 items-center justify-center sm:h-30">
        <FilledButton
          disabled={isPending}
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
