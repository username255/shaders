import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Northern Lights Shader - Psychedelic Waves',
  description: 'Psychedelic wave interference patterns creating vibrant, flowing colors',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}