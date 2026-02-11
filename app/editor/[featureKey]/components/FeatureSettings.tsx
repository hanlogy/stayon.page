import { FormFieldRegister } from '@hanlogy/react-web-ui';
import { SelectField, TextField } from '@/component/form/fields';
import { formId } from '../constants';

export function FeatureSettings({
  register,
}: {
  register: FormFieldRegister<{
    readPasscode?: string;
    editPasscode?: string;
    expiresAfter: string;
  }>;
}) {
  return (
    <div className="space-y-8">
      <TextField
        label="View passcode"
        helper="Leave blank to make this public."
        form={formId}
        controller={register('readPasscode')}
        type="text"
      />

      <TextField
        label="Edit passcode"
        form={formId}
        controller={register('editPasscode')}
        helper="Leave blank to allow anyone who can view to edit."
        type="text"
      />

      <SelectField
        options={[
          { value: '7', label: '7 days' },
          { value: '30', label: '30 days' },
        ]}
        label="Expires after"
        helper="This content will be permanently deleted after the selected number of days."
        form={formId}
        controller={register('expiresAfter')}
      />
    </div>
  );
}
