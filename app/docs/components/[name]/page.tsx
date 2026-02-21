"use client";

import { use } from "react";
import { ComponentPage } from "@/views/docs/ComponentPage";

export default function ComponentDocPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = use(params);
  return <ComponentPage name={name} />;
}
