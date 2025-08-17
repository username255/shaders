import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aurora Shader - Volumetric Aurora Borealis',
  description: 'Volumetric aurora borealis effect using raymarching and Perlin noise',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}