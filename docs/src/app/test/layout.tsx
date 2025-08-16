import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Shader - Raymarching Fractal',
  description: 'Raymarching fractal tunnel with dynamic lighting - GLSL experimentation playground',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}