import { useState } from 'react';
import { IconButton } from '@hanlogy/react-web-ui';
import { CheckIcon, CopyIcon } from 'lucide-react';

export function RsvpConfirmedView({ code }: { code: string }) {
  const formattedCode = code
    .replaceAll('-', '')
    .replace(/(\d{3})(\d{3})/, '$1-$2');

  const [copied, setCopied] = useState(false);

  return (
    <div>
      <div className="text-lg text-gray-600">Your code is:</div>
      <div className="flex items-center">
        <div className="my-2 rounded-sm bg-gray-700 px-4 py-1 text-2xl text-white">
          {formattedCode}
        </div>
        <IconButton
          onClick={async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
        </IconButton>
      </div>
      <div className="text-gray-500 italic">
        Use this code to edit or cancel your response.
      </div>
    </div>
  );
}
