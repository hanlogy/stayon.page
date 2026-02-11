'use client';

import { useState, SubmitEvent } from 'react';
import {
  clsx,
  DialogProvider,
  FlexCenter,
  useForm,
} from '@hanlogy/react-web-ui';
import { FeatureType } from '@/definitions/types';
import ChecklistEditor from './checklist/ChecklistEditor';
import { EditorTabs } from './components/EditorTabs';
import { FeatureSettings } from './components/FeatureSettings';
import EventEditor from './event/EventEditor';
import PollEditor from './poll/PollEditor';
import TimeSlotsEditor from './time-slots/TimeSlotsEditor';
import { EditorTabName } from './types';

export function EditorClient({ featureType }: { featureType: FeatureType }) {
  const [tabName, setTabName] = useState<EditorTabName>('detail');
  const { register, validate } = useForm<Record<string, string>>();

  const onValidate = (e: SubmitEvent) => {
    if (!validate()) {
      e.preventDefault();
    }
  };

  return (
    <DialogProvider>
      <FlexCenter className="mt-8 mb-8">
        <EditorTabs tabName={tabName} onChange={setTabName} />
      </FlexCenter>
      <div>
        <div className={clsx('contents', { hidden: tabName !== 'settings' })}>
          <FeatureSettings register={register} />
        </div>
        <div className={clsx('contents', { hidden: tabName !== 'detail' })}>
          {(() => {
            switch (featureType) {
              case 'checklist':
                return (
                  <ChecklistEditor
                    setTabName={setTabName}
                    register={register}
                    onValidate={onValidate}
                  />
                );
              case 'event':
                return <EventEditor />;
              case 'poll':
                return <PollEditor />;
              case 'timeSlots':
                return <TimeSlotsEditor />;
            }
          })()}
        </div>
      </div>
    </DialogProvider>
  );
}
