import { FormFieldRegister } from '@hanlogy/react-web-ui';
import { SelectField } from '@/component/form/fields';
import { expiresAfterOptions } from '@/definitions/constants';
import { formId } from '../constants';
import { SettingsFormData } from '../types';
import { PasswordField } from './PasswordField';

export function FeatureSettings({
  register,
  defaultValues: { expiresAfter, hasViewPasscode, hasAdminPasscode },
}: {
  register: FormFieldRegister<SettingsFormData>;
  defaultValues: Pick<SettingsFormData, 'expiresAfter'> & {
    hasViewPasscode: boolean;
    hasAdminPasscode: boolean;
  };
}) {
  return (
    <div className="space-y-8">
      <PasswordField
        hasPasscode={hasViewPasscode}
        label="View passcode"
        helper="Leave blank to make this public."
        setController={register('viewPasscode')}
        deleteController={register('deleteViewPasscode')}
      />

      <PasswordField
        hasPasscode={hasAdminPasscode}
        label="Admin passcode"
        setController={register('adminPasscode')}
        deleteController={register('deleteAdminPasscode')}
        helper="Leave blank to allow anyone who can view to manage."
      />

      <SelectField
        defaultValue={expiresAfter}
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
