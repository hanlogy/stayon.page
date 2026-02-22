import { useState } from 'react';
import {
  FormDataConstraint,
  FormFieldController,
  HiddenField,
  IconButton,
  InputLabel,
  KeyOfFormData,
} from '@hanlogy/react-web-ui';
import clsx from 'clsx';
import { XIcon } from 'lucide-react';
import { OutlinedButton } from '@/component/buttons';
import { TextField } from '@/component/form/fields';
import { formId } from '../constants';

export function PasswordField<
  FormDataT extends FormDataConstraint<FormDataT>,
  FormFieldNameT extends KeyOfFormData<FormDataT>,
  FormFieldValueT extends FormDataT[FormFieldNameT],
>({
  label,
  helper,
  hasPasscode,
  setController,
  deleteController,
}: {
  hasPasscode: boolean;
  label: string;
  helper: string;
  setController: FormFieldController<
    FormDataT,
    FormFieldNameT,
    FormFieldValueT
  >;
  deleteController: FormFieldController<
    FormDataT,
    FormFieldNameT,
    FormFieldValueT
  >;
}) {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isChange, setIsChange] = useState<boolean>(false);

  return (
    <>
      {(() => {
        if (!hasPasscode || isChange) {
          const textField = (
            <TextField
              label={label}
              helper={helper}
              placeholder={isChange ? 'Enter new passcode' : ''}
              form={formId}
              controller={setController}
              type="password"
            />
          );
          if (!hasPasscode) {
            return textField;
          }

          return (
            <div className="flex items-center">
              <div className="flex-1">{textField}</div>
              <IconButton
                onClick={() => {
                  setController.reset();
                  setIsChange(false);
                }}
              >
                <XIcon />
              </IconButton>
            </div>
          );
        }

        return (
          <div>
            <InputLabel className="text-gray-500">{label}</InputLabel>
            <div
              className={clsx(
                'flex items-center space-x-3 border-b border-b-gray-200 py-2'
              )}
            >
              {isDelete ? (
                <>
                  <HiddenField
                    defaultValue={isDelete ? 'yes' : 'no'}
                    controller={deleteController}
                  />
                  <div className="pl-3 text-red-600">Marked for deletion.</div>
                  <OutlinedButton
                    onClick={() => setIsDelete(false)}
                    size="xsmall"
                  >
                    Undo
                  </OutlinedButton>
                </>
              ) : (
                <>
                  <OutlinedButton
                    onClick={() => setIsChange(true)}
                    size="xsmall"
                  >
                    Change
                  </OutlinedButton>
                  <OutlinedButton
                    onClick={() => setIsDelete(true)}
                    size="xsmall"
                  >
                    Delete
                  </OutlinedButton>
                </>
              )}
            </div>
          </div>
        );
      })()}
    </>
  );
}
