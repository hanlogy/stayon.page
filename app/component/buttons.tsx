import { Button, type ButtonProps } from '@hanlogy/react-web-ui';
import clsx from 'clsx';

export function TextButton({ className, ...rest }: ButtonProps) {
  return (
    <Button
      className={clsx(
        'bg-white text-gray-800 hover:bg-gray-100 active:bg-gray-100',
        className
      )}
      {...rest}
    />
  );
}

export function OutlinedButton({ className, ...rest }: ButtonProps) {
  return (
    <TextButton
      className={clsx('border border-gray-300', className)}
      {...rest}
    />
  );
}

export function FilledButton({ className, ...rest }: ButtonProps) {
  return (
    <Button
      className={clsx(
        'bg-gray-700 text-white hover:bg-gray-900 active:bg-gray-900',
        className
      )}
      {...rest}
    />
  );
}
