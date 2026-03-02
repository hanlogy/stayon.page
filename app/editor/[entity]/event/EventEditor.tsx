'use client';

import { useMemo, useState } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import {
  CheckboxField,
  SelectField,
  TextareaField,
  TextField,
} from '@/component/form/fields';
import { type Event, eventTypes } from '@/definitions';
import { EditorLayout } from '@/editor/components/EditorLayout';
import { EntityNameField } from '@/editor/components/EntityNameField';
import { WithExtraFields } from '@/editor/components/WithExtraFields';
import { safeParseField, safeParseFields } from '@/helpers/schemaHelpers';
import { normalizeDateTime, transformDateTime } from '../../helpers';
import { type EventFormData, publishEvent } from './actions';
import { startTimeSchema, timeFieldsSchema } from './schema';

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
      rsvpDeadline,
    } = initialData;

    return {
      name,
      startTime: normalizeDateTime(startTime),
      endTime: normalizeDateTime(endTime),
      type: type && eventTypes.includes(type) ? type : '',
      location,
      description,
      isRsvpRequired,
      rsvpDeadline: normalizeDateTime(rsvpDeadline),
    };
  }, [initialData]);

  const { register, setFieldValue } = formManager;

  const [withRsvpDeadline, setWithRsvpDeadline] = useState<boolean>(
    !!defaultValues.isRsvpRequired
  );

  return (
    <EditorLayout
      nameForTitle="event"
      className="mx-auto max-w-2xl space-y-4"
      initialData={initialData}
      action={publishEvent}
      getValues={() => formManager.getValues()}
      formManager={formManager}
    >
      <div className="space-y-6">
        <EntityNameField
          label="Event name"
          register={register}
          defaultValue={defaultValues.name}
        />
        <WithExtraFields
          isExpandedDefault={!!!!defaultValues.endTime}
          label="End date and time"
          onToggle={(v) => {
            if (!v) {
              setFieldValue('endTime', '');
            }
          }}
          extra={
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
          }
        >
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
        </WithExtraFields>

        <SelectField
          defaultValue={defaultValues.type}
          label="In persion or virtural?"
          isOptional
          controller={register('type')}
          options={eventTypes.map((v) => ({
            value: v,
            label: { '': '', inPerson: 'In person', virtual: 'virtual' }[v],
          }))}
        />
        <TextField
          defaultValue={defaultValues.location}
          label="Address / URL"
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
          controller={register('isRsvpRequired', {
            onValueChange: ({ isRsvpRequired }) => {
              setWithRsvpDeadline(!!isRsvpRequired);
            },
          })}
          label="RSVP required"
        />
        {withRsvpDeadline && (
          <TextField
            defaultValue={defaultValues.rsvpDeadline}
            label="RSVP deadline"
            controller={register('rsvpDeadline', {
              transform: transformDateTime,
            })}
            type="datetime-local"
          />
        )}
      </div>
    </EditorLayout>
  );
}
