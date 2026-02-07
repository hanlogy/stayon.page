import { Appbar } from '@/component/Appbar';
import Footer from '@/component/Footer';
import { LogoIcon } from '@/component/icons';

export default function HomeLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Appbar>
        <div className="ml-4 flex items-center">
          <LogoIcon className="mr-2 h-6 w-6" />
          <div className="text-xl font-medium">StayOn</div>
        </div>
      </Appbar>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
