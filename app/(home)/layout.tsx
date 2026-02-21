import { Layout } from '@/component/Layout';
import { LazyLink } from '@/component/LazyLink';
import { GitHubIcon } from '@/component/icons';

const menuItems = [
  /*{ label: 'About', target: '/about' }*/
] as const;

export default function HomeLayout({ children }: LayoutProps<'/'>) {
  return (
    <Layout
      leading="logo"
      trailing={
        <div className="flex items-center space-x-4">
          {menuItems.map(({ label, target }) => {
            return (
              <LazyLink
                className="font-medium text-gray-600 hover:text-gray-800"
                key={label}
                href={target}
              >
                {label}
              </LazyLink>
            );
          })}
          <a href="https://github.com/hanlogy/stayon.page" target="_blank">
            <GitHubIcon className="w-5" />
          </a>
        </div>
      }
    >
      {children}
    </Layout>
  );
}
