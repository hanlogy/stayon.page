import { ReactNode, SVGProps } from 'react';

type SvgIconProps = {
  viewBox: string;
  children: ReactNode;
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox'>;

export function SvgIcon({
  className,
  viewBox,
  children,
  ...rest
}: SvgIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}
