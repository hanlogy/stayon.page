'use client';

import { useMemo, useState } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import { SelectField, TextareaField, TextField } from '@/component/form/fields';
import { pollResultsVisibilities } from '@/definitions/constants';
import type { Poll } from '@/definitions/types';
import { AddOrRemoveFieldToggle } from '@/editor/components/AddOrRemoveFieldToggle';
import { EditorLayout } from '@/editor/components/EditorLayout';
import { EntityNameField } from '@/editor/components/EntityNameField';
import {
  AddButtonWithIcon,
  DeleteIconButton,
  EditIconButton,
} from '@/editor/components/buttons';
import { normalizeDateTime, transformDateTime } from '../../helpers';
import { PollFormData, publishPoll } from './actions';
import { usePollQuestionDialog } from './usePollQuestionDialog';

export function PollEditor({ initialData }: { initialData?: Poll }) {
  const formManager = useForm<PollFormData>();
  const defaultValues = useMemo(() => {
    const {
      name,
      note = '',
      closesAt,
      resultsVisibility,
      questions = [],
    } = initialData ?? {};

    return {
      name,
      note,
      closesAt: closesAt ? normalizeDateTime(closesAt) : '',
      resultsVisibility,
      questions,
    };
  }, [initialData]);

  const { questions, setQuestions, openQuestionDialog } = usePollQuestionDialog(
    defaultValues.questions
  );

  const [withCloseAt, setWithCloseAt] = useState<boolean>(
    !!defaultValues.closesAt
  );

  const { register, setFieldValue } = formManager;

  return (
    <EditorLayout
      nameForTitle="poll"
      className="mx-auto max-w-2xl space-y-4"
      initialData={initialData}
      action={publishPoll}
      getValues={() => ({ ...formManager.getValues(), questions })}
      formManager={formManager}
    >
      <div className="space-y-6">
        <EntityNameField
          label="Poll name"
          register={register}
          defaultValue={defaultValues.name}
        />
        <TextareaField
          defaultValue={defaultValues.note}
          label="Note"
          controller={register('note')}
        />
        <div>
          <SelectField
            defaultValue={defaultValues.resultsVisibility}
            label="Vote results visibility"
            controller={register('resultsVisibility')}
            options={pollResultsVisibilities.map((v) => ({
              value: v,
              label: {
                always: 'Always',
                afterSubmit: 'After submit',
                afterClose: 'After close',
              }[v],
            }))}
          />
          {!withCloseAt && (
            <AddOrRemoveFieldToggle
              onClick={() => {
                setWithCloseAt(true);
              }}
              label="Close time"
              isAdd={true}
            />
          )}
        </div>
        {withCloseAt && (
          <div>
            <TextField
              label="Close at"
              defaultValue={defaultValues.closesAt}
              controller={register('closesAt', {
                transform: transformDateTime,
              })}
              type="datetime-local"
            />
            <AddOrRemoveFieldToggle
              label="Close time"
              isAdd={false}
              onClick={() => {
                setWithCloseAt(false);
                setFieldValue('closesAt', '');
              }}
            />
          </div>
        )}
      </div>
      <div className="mt-6 text-xl">Questions</div>
      <div className="py-4">
        {!questions.length && (
          <div className="py-4 text-center text-gray-500 italic">
            No questions
          </div>
        )}
        {questions.map((question) => {
          const { pollQuestionId, title, isRequired, isMultiple } = question;
          return (
            <div
              key={pollQuestionId}
              className="questions-center flex border-b border-b-gray-200 py-2 pl-1"
            >
              <div className="flex flex-1 flex-col justify-center">
                <div className="font-medium">{title}</div>
                {(isRequired || isMultiple) && (
                  <div className="mt-1 flex space-x-2 text-sm font-semibold text-gray-500">
                    {isRequired && <span>Required</span>}
                    {isMultiple && <span>multiple-choice</span>}
                  </div>
                )}
              </div>
              <div>
                <EditIconButton onClick={() => openQuestionDialog(question)} />
                <DeleteIconButton
                  onClick={() =>
                    setQuestions((prev) => {
                      return prev.filter(
                        (e) => e.pollQuestionId !== pollQuestionId
                      );
                    })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="py-4 text-center">
        <AddButtonWithIcon onClick={() => openQuestionDialog()}>
          Add question
        </AddButtonWithIcon>
      </div>
    </EditorLayout>
  );
}
