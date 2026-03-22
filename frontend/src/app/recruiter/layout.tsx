"use client";

import { Layout } from "@/components/wireframe/Layout";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout role="recruiter">{children}</Layout>;
}
