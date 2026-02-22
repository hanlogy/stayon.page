import { FormFieldRegister } from '@hanlogy/react-web-ui';
import { TextField } from '@/component/form/fields';
import { entityNameSchema } from '../schema/common';
import { safeParseField } from '../schema/helpers';
import { useEditorContext } from '../state/hooks';

export function EntityNameField({
  defaultValue,
  register,
}: {
  defaultValue?: string;
  register: FormFieldRegister<{ name: string }>;
}) {
  const { setTabName } = useEditorContext();

  return (
    <TextField
      defaultValue={defaultValue}
      label="Checklist name"
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
