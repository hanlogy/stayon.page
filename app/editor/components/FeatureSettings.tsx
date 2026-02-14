import { FormFieldRegister } from '@hanlogy/react-web-ui';
import { SelectField, TextField } from '@/component/form/fields';
import { formId } from '../constants';
import { SettingsFormData } from '../types';

export function FeatureSettings({
  register,
}: {
  register: FormFieldRegister<SettingsFormData>;
}) {
  return (
    <div className="space-y-8">
      <TextField
        label="View passcode"
        helper="Leave blank to make this public."
        form={formId}
        controller={register('viewPasscode')}
        type="text"
      />

      <TextField
        label="Admin passcode"
        form={formId}
        controller={register('adminPasscode')}
        helper="Leave blank to allow anyone who can view to manage."
        type="text"
      />

      <SelectField
        options={[
          { value: '1', label: '24 hours' },
          { value: '7', label: '7 days' },
          { value: '30', label: '30 days' },
        ]}
        defaultValue="7"
        label="Expires after"
        helper="This content will be permanently deleted after the selected number of days."
        form={formId}
        controller={register('expiresAfter')}
      />
    </div>
  );
}
