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
import { ActionResponse, ShareableCommon } from '@/definitions/types';
import { formId } from '../constants';
import { useEditorContext } from '../state/hooks';
import { SettingsFormData } from '../types';
import { DeleteEntity } from './DeleteEntity/DeleteEntity';
import { EditorTabs } from './EditorTabs';
import { FeatureSettings } from './FeatureSettings';

export function EditorLayout<
  T extends FormDataConstraint<T>,
  DataT extends ShareableCommon,
>({
  nameForTitle,
  className,
  children,
  action,
  formManager,
  initialData,
}: PropsWithChildren<{
  nameForTitle: string;
  className?: string;
  action: (
    shortId: string | undefined,
    formData: Partial<T & SettingsFormData>
  ) => ActionResponse | Promise<ActionResponse>;
  formManager: FormManager<T & SettingsFormData>;
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
        expiresAfter: '7',
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

    setError(null);
    setIsPending(true);
    const { success, error } = await action(shortId, formManager.getValues());

    if (!success) {
      setError(error?.message ?? 'Something is wrong');
    }
    setIsPending(false);
  };
  const title = `${isManage ? 'Manage' : 'Create'} ${nameForTitle}`;

  return (
    <Layout
      title={
        <div className="w-full text-center text-xl font-medium text-gray-600">
          {title}
        </div>
      }
      leading="home"
      withFooter={false}
      trailing={
        shortId && (
          <LazyLink
            href={`/${shortId}`}
            className="flex items-center font-semibold"
          >
            <EyeIcon size={18} className="mr-1" />
            View
          </LazyLink>
        )
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
      <div className="pointer-events-none fixed right-0 bottom-0 left-0 flex h-22 items-center justify-center space-x-4 sm:h-30">
        {shortId && <DeleteEntity shortId={shortId} />}
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
