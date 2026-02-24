import { FormFieldRegister } from '@hanlogy/react-web-ui';
import { TextField } from '@/component/form/fields';
import { safeParseField } from '@/helpers/schemaHelpers';
import { entityNameSchema } from '../schema/common';
import { useEditorContext } from '../state/hooks';

export function EntityNameField({
  label,
  defaultValue,
  register,
}: {
  label: string;
  defaultValue?: string;
  register: FormFieldRegister<{ name: string }>;
}) {
  const { setTabName } = useEditorContext();

  return (
    <TextField
      defaultValue={defaultValue}
      label={label}
      maxLength={200}
      controller={register('name', {
        validator: ({ name }) => {
          const { error } = safeParseField(entityNameSchema, name);
          if (error) {
            setTabName('detail');
            return error;
          }
        },
      })}
    />
  );
}
