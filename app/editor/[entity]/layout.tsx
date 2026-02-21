import { Metadata } from 'next';

export const metadata: Metadata = {
  title: null,
};

export default function EditorLayout({
  children,
}: LayoutProps<'/editor/[entity]'>) {
  return children;
}
