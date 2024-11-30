"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Menu} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex flex-col space-y-4 mt-4">
          <Link href="/dashboard" className="text-sm font-medium" onClick={() => setOpen(false)}>
            Dashboard
          </Link>
          <Link href="/playground" className="text-sm font-medium" onClick={() => setOpen(false)}>
            Documentation
          </Link>
          <Link href="/support" className="text-sm font-medium" onClick={() => setOpen(false)}>
            Support
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
