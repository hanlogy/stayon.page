import { HomeIcon } from 'lucide-react';
import { LazyLink } from './LazyLink';

export function HomeLink() {
  return (
    <LazyLink
      href="/"
      className="fixed ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
    >
      <HomeIcon className="w-5" />
    </LazyLink>
  );
}
