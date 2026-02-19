import { FormFieldRegister } from '@hanlogy/react-web-ui';
import { SelectField } from '@/component/form/fields';
import { expiresAfterOptions } from '@/definitions/constants';
import { ShareableCommon } from '@/definitions/types';
import { formId } from '../constants';
import { SettingsFormData } from '../types';
import { PasswordField } from './PasswordField';

export function FeatureSettings<InitialValuesT extends ShareableCommon>({
  register,
  initialValues,
}: {
  register: FormFieldRegister<SettingsFormData>;
  initialValues: InitialValuesT | undefined;
}) {
  const {
    expiresAfter = 7,
    viewPasscodeVersion,
    adminPasscodeVersion,
  } = initialValues ?? {};

  return (
    <div className="space-y-8">
      <PasswordField
        hasPasscode={!!viewPasscodeVersion}
        label="View passcode"
        helper="Leave blank to make this public."
        setController={register('viewPasscode')}
        deleteController={register('deleteViewPasscode')}
      />

      <PasswordField
        hasPasscode={!!adminPasscodeVersion}
        label="Admin passcode"
        setController={register('adminPasscode')}
        deleteController={register('deleteAdminPasscode')}
        helper="Leave blank to allow anyone who can view to manage."
      />

      <SelectField
        defaultValue={String(expiresAfter)}
        options={expiresAfterOptions.map((v) => ({
          value: v,
          label: { '1': '24 hours', '7': '7 days', '30': '30 days' }[v],
        }))}
        label="Expires after"
        helper="This content will be permanently deleted after the selected number of days."
        form={formId}
        controller={register('expiresAfter')}
      />
    </div>
  );
}
