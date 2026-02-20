import Link from 'next/link';

export function LazyLink({
  children,
  ...rest
}: Omit<Parameters<typeof Link>[0], 'prefetch'>) {
  return (
    <Link {...rest} prefetch={false}>
      {children}
    </Link>
  );
}
