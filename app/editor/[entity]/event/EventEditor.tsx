'use client';

import { useMemo, useState } from 'react';
import { useForm } from '@hanlogy/react-web-ui';
import { SelectField, TextareaField, TextField } from '@/component/form/fields';
import { eventTypes } from '@/definitions/constants';
import { Event } from '@/definitions/types';
import { EditorLayout } from '@/editor/components/EditorLayout';
import { EntityNameField } from '@/editor/components/EntityNameField';
import { safeParseField, safeParseFields } from '@/helpers/schemaHelpers';
import { normalizeDateTime, transformDateTime } from '../../helpers';
import { DateTimeFieldToggle } from './DateTimeFieldToggle';
import { RsvpListButton } from './RsvpListButton';
import { EventFormData, publishEvent } from './actions';
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
      rsvpDeadline,
    } = initialData;

    return {
      name,
      startTime: normalizeDateTime(startTime),
      endTime: normalizeDateTime(endTime),
      type: type && eventTypes.includes(type) ? type : '',
      location,
      description,
      rsvpDeadline: normalizeDateTime(rsvpDeadline),
    };
  }, [initialData]);

  const [withEndTime, setWithEndTime] = useState<boolean>(
    !!defaultValues.endTime
  );

  const [withRsvpDeadline, setWithRsvpDeadline] = useState<boolean>(
    !!defaultValues.rsvpDeadline
  );
  const { register, setFieldValue } = formManager;

  return (
    <EditorLayout
      nameForTitle="event"
      className="mx-auto max-w-2xl space-y-4"
      initialData={initialData}
      action={publishEvent}
      getValues={() => formManager.getValues()}
      formManager={formManager}
      topbar={
        initialData?.shortId &&
        initialData.rsvpDeadline && (
          <div className="flex-center mt-2">
            <RsvpListButton shortId={initialData.shortId} />
          </div>
        )
      }
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
            <DateTimeFieldToggle
              field="endTime"
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
            <DateTimeFieldToggle
              field="endTime"
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
          label="Address / URL"
          controller={register('location')}
        />
        <div>
          <TextareaField
            rows={5}
            defaultValue={defaultValues.description}
            label="Description"
            controller={register('description')}
          />
          {!withRsvpDeadline && (
            <DateTimeFieldToggle
              field="rsvpDeadline"
              isAdd={true}
              onClick={() => {
                setWithRsvpDeadline(true);
              }}
            />
          )}
        </div>
        {withRsvpDeadline && (
          <div>
            <TextField
              defaultValue={defaultValues.rsvpDeadline}
              label="RSVP deadline"
              controller={register('rsvpDeadline', {
                transform: transformDateTime,
              })}
              type="datetime-local"
            />
            <DateTimeFieldToggle
              field="rsvpDeadline"
              isAdd={false}
              onClick={() => {
                setWithRsvpDeadline(false);
                setFieldValue('rsvpDeadline', '');
              }}
            />
          </div>
        )}
      </div>
    </EditorLayout>
  );
}
