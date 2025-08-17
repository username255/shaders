import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Infinite Travel Shader - Raymarching Fractal',
  description: 'Raymarching fractal tunnel with dynamic lighting creating an infinite travel experience',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}