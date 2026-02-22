'use client';

import { useMemo, useState } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import { toDate } from '@hanlogy/ts-lib';
import {
  CheckboxField,
  SelectField,
  TextareaField,
  TextField,
} from '@/component/form/fields';
import { eventTypes } from '@/definitions/constants';
import { Event } from '@/definitions/types';
import { EditorForm } from '@/editor/components/EditorForm';
import { EntityNameField } from '@/editor/components/EntityNameField';
import { safeParseField, safeParseFields } from '@/editor/schema/helpers';
import { toLocalISODateTime } from '@/helpers/toLocalISODateTime';
import { EndTimeToggleButton } from './EndTimeToggleButton';
import { EventFormData, publishEvent } from './actions';
import { startTimeSchema, timeFieldsSchema } from './schema';

function transformDateTime(input?: string | undefined) {
  if (!input) {
    return '';
  }

  return new Date(input).toISOString();
}

export function EventEditor({ initialData }: { initialData?: Event }) {
  const formManager = useForm<EventFormData>();

  const defaultValues = useMemo(() => {
    if (!initialData) {
      return {};
    }
    const {
      name,
      startTime,
      endTime,
      type,
      location,
      description,
      isRsvpRequired,
    } = initialData;

    return {
      name,
      startTime: startTime
        ? toLocalISODateTime(toDate(startTime)).dateTime
        : '',
      endTime: endTime ? toLocalISODateTime(toDate(endTime)).dateTime : '',
      type: type && eventTypes.includes(type) ? type : '',
      location,
      description,
      isRsvpRequired: isRsvpRequired === true,
    };
  }, [initialData]);

  const [withEndTime, setWithEndTime] = useState<boolean>(!!defaultValues.endTime);
  const { register, setFieldValue } = formManager;

  return (
    <EditorForm
      className="mx-auto max-w-2xl space-y-4"
      initialValues={initialData}
      action={publishEvent}
      formManager={formManager}
    >
      <div className="space-y-6">
        <EntityNameField
          label="Event name"
          register={register}
          defaultValue={defaultValues.name}
        />
        <div>
          <TextField
            defaultValue={defaultValues.startTime}
            label="Start date and time"
            controller={register('startTime', {
              transform: transformDateTime,
              validator: ({ startTime }) => {
                const { error } = safeParseField(startTimeSchema, startTime);
                if (error) {
                  return error;
                }
              },
            })}
            type="datetime-local"
          />
          {!withEndTime && (
            <EndTimeToggleButton
              isAdd={true}
              onClick={() => {
                setWithEndTime(true);
              }}
            />
          )}
        </div>

        {withEndTime && (
          <div>
            <TextField
              defaultValue={defaultValues.endTime}
              label="End date and time"
              controller={register('endTime', {
                transform: transformDateTime,
                validator: ({ startTime, endTime }) => {
                  if (!startTime) {
                    return;
                  }
                  const { error } = safeParseFields(timeFieldsSchema, {
                    startTime,
                    endTime,
                  });
                  if (!error) {
                    return;
                  }
                  return error.endTime;
                },
              })}
              type="datetime-local"
            />
            <EndTimeToggleButton
              isAdd={false}
              onClick={() => {
                setWithEndTime(false);
                setFieldValue('endTime', '');
              }}
            />
          </div>
        )}
        <SelectField
          defaultValue={defaultValues.type}
          label="In persion or virtural?"
          controller={register('type')}
          options={(['', ...eventTypes] as const).map((v) => ({
            value: v,
            label: { '': '', inPerson: 'In person', virtual: 'virtual' }[v],
          }))}
        />
        <TextField
          defaultValue={defaultValues.location}
          label="Location"
          controller={register('location')}
        />
        <TextareaField
          rows={5}
          defaultValue={defaultValues.description}
          label="Description"
          controller={register('description')}
        />
        <CheckboxField
          defaultChecked={defaultValues.isRsvpRequired}
          label="Need to Rsvp"
          controller={register('isRsvpRequired')}
        />
      </div>
    </EditorForm>
  );
}
