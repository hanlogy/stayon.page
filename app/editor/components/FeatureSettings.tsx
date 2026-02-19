import { FormFieldRegister } from '@hanlogy/react-web-ui';
import { SelectField, TextField } from '@/component/form/fields';
import { expiresAfterOptions } from '@/definitions/constants';
import { ShareableCommon } from '@/definitions/types';
import { formId } from '../constants';
import { SettingsFormData } from '../types';

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

  const hasViewPasscode = !!viewPasscodeVersion;
  const hasAdminPasscode = !!adminPasscodeVersion;

  return (
    <div className="space-y-8">
      <TextField
        label="View passcode"
        helper="Leave blank to make this public."
        form={formId}
        controller={register('viewPasscode')}
        type="password"
      />

      <TextField
        label="Admin passcode"
        form={formId}
        controller={register('adminPasscode')}
        helper="Leave blank to allow anyone who can view to manage."
        type="password"
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
