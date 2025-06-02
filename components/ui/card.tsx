import * as React from 'react';

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border bg-white p-4 shadow-sm">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-gray-800 leading-relaxed">{children}</div>;
}