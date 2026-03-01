import { useState, SubmitEvent, PropsWithChildren, useMemo } from 'react';
import {
  clsx,
  FlexCenter,
  FormDataConstraint,
  FormManager,
} from '@hanlogy/react-web-ui';
import { EyeIcon } from 'lucide-react';
import { Layout } from '@/component/Layout';
import { LazyLink } from '@/component/LazyLink';
import { FilledButton } from '@/component/buttons';
import type { ActionResponse, ShareableCommon } from '@/definitions';
import { formId } from '../constants';
import { useEditorContext } from '../state/hooks';
import { SettingsFormData } from '../types';
import { DeleteEntity } from './DeleteEntity/DeleteEntity';
import { EditorTabs } from './EditorTabs';
import { FeatureSettings } from './FeatureSettings';

export function EditorLayout<
  FormDataT extends FormDataConstraint<FormDataT> & SettingsFormData,
  ActionDataT extends object,
  DataT extends ShareableCommon,
>({
  nameForTitle,
  className,
  children,
  action,
  getValues,
  formManager,
  initialData,
}: PropsWithChildren<{
  nameForTitle: string;
  className?: string;
  action: (
    shortId: string | undefined,
    actionData: ActionDataT
  ) => ActionResponse | Promise<ActionResponse>;
  getValues: () => ActionDataT | undefined | null;
  formManager: FormManager<FormDataT>;
  initialData: DataT | undefined;
}>) {
  const { tabName } = useEditorContext();
  const { validate, register } = formManager;
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const shortId = initialData?.shortId;
  const isManage = !!shortId;

  const defaultValues = useMemo(() => {
    if (!initialData) {
      return {
        hasViewPasscode: false,
        hasAdminPasscode: false,
        expiresAfter: '30',
      };
    }
    const { viewPasscodeVersion, adminPasscodeVersion, expiresAfter } =
      initialData;

    return {
      hasViewPasscode: !!viewPasscodeVersion,
      hasAdminPasscode: !!adminPasscodeVersion,
      expiresAfter: String(expiresAfter),
    };
  }, [initialData]);

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    const values = getValues();
    if (!values) {
      return;
    }

    setError(null);
    setIsPending(true);
    const { success, error } = await action(shortId, values);

    if (!success) {
      setError(error?.message ?? 'Something is wrong');
    }
    setIsPending(false);
  };
  const title = `${isManage ? 'Update' : 'Create'} ${nameForTitle}`;

  return (
    <Layout
      title={
        <div className="w-full text-center font-medium text-gray-600 sm:text-xl">
          {title}
        </div>
      }
      leading="home"
      withFooter={false}
      trailing={
        <div className="flex items-center space-x-2 sm:space-x-4">
          {shortId && (
            <>
              <LazyLink
                href={`/${shortId}`}
                className="flex items-center font-semibold text-gray-600 hover:text-gray-800"
              >
                <EyeIcon size={18} />
                <span className="ml-1 hidden sm:block">View</span>
              </LazyLink>
              <DeleteEntity shortId={shortId} />
            </>
          )}
        </div>
      }
    >
      <title>{title}</title>
      <div className={clsx('mx-auto px-4', className)}>
        <FlexCenter className="mt-8 mb-8">
          <EditorTabs />
        </FlexCenter>
        <form autoComplete="off" id={formId} onSubmit={onSubmit}>
          <div className={clsx('contents', { hidden: tabName !== 'settings' })}>
            <FeatureSettings
              defaultValues={defaultValues}
              register={register}
            />
          </div>
          <div className={clsx('contents', { hidden: tabName !== 'detail' })}>
            {children}
          </div>
        </form>
        <div className="p-4 text-center text-red-600">{error}</div>
      </div>
      <div className="h-22 sm:h-30"></div>
      <div className="pointer-events-none fixed right-0 bottom-0 left-0 z-50 flex h-22 items-center justify-center sm:h-30">
        <FilledButton
          disabled={isPending}
          type="submit"
          size="medium"
          form={formId}
          className="min-w-50"
        >
          {isManage ? 'Update' : 'Publish'}
        </FilledButton>
      </div>
    </Layout>
  );
}
