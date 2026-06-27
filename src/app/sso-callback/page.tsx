"use client"

import dynamic from "next/dynamic"

const SSOCallbackClient = dynamic(
  () => import("./SSOCallbackClient"),
  { ssr: false },
)

export default function SSOCallbackPage() {
  return <SSOCallbackClient />
}
