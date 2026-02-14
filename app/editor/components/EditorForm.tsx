import { useState, SubmitEvent, ReactNode } from 'react';
import {
  clsx,
  FlexCenter,
  FormDataConstraint,
  FormManager,
} from '@hanlogy/react-web-ui';
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
  action: (formData: FormData) => void | Promise<void>;
  formManager: FormManager<T & SettingsFormData>;
}) {
  const { validate, register } = formManager;
  const [tabName, setTabName] = useState<EditorTabName>('detail');

  const onSubmit = (e: SubmitEvent) => {
    if (!validate()) {
      e.preventDefault();
      return;
    }
  };

  return (
    <>
      <FlexCenter className="mt-8 mb-8">
        <EditorTabs tabName={tabName} onChange={setTabName} />
      </FlexCenter>
      <form autoComplete="off" action={action} id={formId} onSubmit={onSubmit}>
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
    </>
  );
}
