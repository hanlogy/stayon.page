import Image from 'next/image';
import { Appbar } from '@/component/Appbar';
import Footer from '@/component/Footer';
import logo from '@/public/logo.svg';

export default function HomeLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Appbar>
        <div className="flex items-center">
          <Image className="mr-2 h-6 w-6" src={logo} alt="logo" />
          <div className="text-xl font-medium">StayOn</div>
        </div>
      </Appbar>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
