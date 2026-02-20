'use client';

import { useState } from 'react';
import {
  CloseDialogFn,
  clsx,
  IconButton,
  useDialog,
} from '@hanlogy/react-web-ui';
import { ClipboardCheckIcon, ClipboardIcon, Share2Icon } from 'lucide-react';
import { Dialog } from '@/component/Dialog';
import { TextButton } from '@/component/buttons';

export function ShareButton({ shortId }: { shortId: string }) {
  const { openDialog } = useDialog();

  return (
    <IconButton
      onClick={() =>
        openDialog(({ closeDialog }) => (
          <ShareDialog shortId={shortId} closeDialog={closeDialog} />
        ))
      }
    >
      <Share2Icon size={18} />
    </IconButton>
  );
}

function ShareDialog({
  closeDialog,
  shortId,
}: {
  closeDialog: CloseDialogFn;
  shortId: string;
}) {
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/` + shortId;
  return (
    <Dialog
      title="Share link"
      actions={
        <>
          <TextButton
            className={clsx({
              'text-gray-800': !copied,
              'text-green-800': copied,
            })}
            onClick={async () => {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            icon={
              copied ? (
                <ClipboardCheckIcon size={18} />
              ) : (
                <ClipboardIcon size={18} />
              )
            }
          >
            Copy To Clipboard
          </TextButton>

          <TextButton onClick={closeDialog}>Close</TextButton>
        </>
      }
    >
      <div className="w-full border-b border-b-gray-300 py-2">{url}</div>
    </Dialog>
  );
}
