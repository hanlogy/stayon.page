import { InputLabel, TextInput } from '@hanlogy/react-web-ui';
import { FilledButton } from '@/component/buttons';

export function SearchRsvpForm() {
  return (
    <div className="pt-2 pb-4">
      <InputLabel className="mb-2 text-gray-600">
        Enter your RSVP code to update.
      </InputLabel>
      <div className="flex">
        <div className="mr-2 flex-1">
          <TextInput
            placeholder="RSVP code"
            className="rounded-xl border border-gray-200 bg-gray-50"
          />
        </div>
        <FilledButton size="medium">Find</FilledButton>
      </div>
    </div>
  );
}
