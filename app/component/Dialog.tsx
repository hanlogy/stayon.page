import { PropsWithChildren, ReactNode } from 'react';
import {
  DialogActionBar,
  DialogScaffold,
  DialogTopbar,
} from '@hanlogy/react-web-ui';
import clsx from 'clsx';
import { PropsWithClassName } from 'node_modules/@hanlogy/react-web-ui/dist/types';

export function Dialog({
  title,
  className,
  children,
  actions,
}: PropsWithChildren<
  PropsWithClassName<{ title?: string; actions?: ReactNode }>
> = {}) {
  return (
    <DialogScaffold
      topbar={
        title && (
          <DialogTopbar className="text-xl font-medium text-gray-600">
            {title}
          </DialogTopbar>
        )
      }
      className={clsx('max-w-md rounded-2xl bg-white', className)}
      bottomBar={actions && <DialogActionBar>{actions}</DialogActionBar>}
    >
      {children}
    </DialogScaffold>
  );
}
