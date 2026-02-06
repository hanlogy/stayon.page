import { HistoryIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo.svg';

export function Header() {
  return (
    <>
      <header className="fixed top-0 right-0 left-0 flex h-14 items-center justify-between bg-white px-4">
        <div className="flex items-center">
          <Image className="mr-2 h-6 w-6" src={logo} alt="logo" />
          <div className="text-xl font-medium">StayOn</div>
        </div>
        <Link href="/history">
          <HistoryIcon className="text-gray-600" size={22} />
        </Link>
      </header>
      <div className="h-14"></div>
    </>
  );
}
