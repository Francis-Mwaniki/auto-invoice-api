"use client"

import { ClipLoader } from "react-spinners"

export function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ClipLoader color="#000000" size={35} />
    </div>
  )
}

