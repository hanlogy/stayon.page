import { useMemo, useState } from 'react';
import { CloseDialogFn, useForm } from '@hanlogy/react-web-ui';
import { Dialog } from '@/component/Dialog';
import { FilledButton, TextButton } from '@/component/buttons';
import { CheckboxField, TextField } from '@/component/form/fields';
import type { PollQuestion, PollQuestionOption } from '@/definitions';
import { QuestionOptionsForm } from './QuestionOptionsForm';

interface FormData {
  title: string;
  isMultiple: boolean;
  isRequired: boolean;
}

export function QuestionEditorDialog({
  closeDialog,
  initialData,
}: {
  closeDialog: CloseDialogFn<PollQuestion>;
  initialData?: Partial<PollQuestion>;
}) {
  const defaultValues = useMemo(() => {
    const {
      title = '',
      isMultiple = false,
      isRequired = false,
      options = [],
    } = initialData ?? {};

    return {
      title,
      isMultiple,
      isRequired,
      options,
    };
  }, [initialData]);
  const { register, getValues, validate } = useForm<FormData>();
  const [options, setOptions] = useState<PollQuestionOption[]>(
    defaultValues.options
  );
  const [error, setError] = useState<string | null>(null);

  const onSubmit = () => {
    if (!validate()) {
      return;
    }
    const validOptions = options.filter(({ label }) => !!label.trim());
    if (validOptions.length < 2) {
      setError('Need to have at least two options');
      return;
    }

    const { title = '', isMultiple = false, isRequired = false } = getValues();

    closeDialog({
      pollQuestionId: crypto.randomUUID(),
      title,
      isMultiple,
      isRequired,
      options: validOptions,
    });
  };

  return (
    <Dialog
      title={initialData ? 'Edit Question' : 'Add Question'}
      actions={
        <>
          <FilledButton className="min-w-26" onClick={() => onSubmit()}>
            Submit
          </FilledButton>
          <TextButton onClick={() => closeDialog()}>Close</TextButton>
        </>
      }
    >
      <div className="space-y-4">
        <TextField
          defaultValue={defaultValues.title}
          autoComplete="off"
          label="Question title"
          controller={register('title', {
            validator: ({ title }) => {
              if (!title?.trim()) {
                return 'Question title is required';
              }
            },
          })}
        />
        <CheckboxField
          defaultChecked={defaultValues.isMultiple}
          controller={register('isMultiple')}
          label="Allow multiple answer"
        />
        <CheckboxField
          defaultChecked={defaultValues.isRequired}
          controller={register('isRequired')}
          label="Is required"
        />
      </div>
      <QuestionOptionsForm
        options={options}
        onAdd={() =>
          setOptions((prev) => {
            return [
              ...prev,
              {
                pollQuestionOptionId: crypto.randomUUID(),
                label: '',
              },
            ];
          })
        }
        onRemove={(id) =>
          setOptions((prev) => {
            return prev.filter((e) => e.pollQuestionOptionId !== id);
          })
        }
        onChange={(id, value) => {
          setError(null);
          setOptions((prev) => {
            return prev.map((e) => {
              return e.pollQuestionOptionId === id ? { ...e, label: value } : e;
            });
          });
        }}
      />
      {error && <div className="mt-2 text-center text-red-600">{error}</div>}
    </Dialog>
  );
}
