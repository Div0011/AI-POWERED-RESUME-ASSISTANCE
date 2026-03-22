"use client";

import { Layout } from "@/components/wireframe/Layout";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout role="candidate">{children}</Layout>;
}
