'use client'

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container max-w-7xl py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cal text-3xl">My Notes</h1>
          <p className="text-muted-foreground mt-2">
            Create, edit and organize your notes.
          </p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">No notes created</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            You haven&apos;t created any notes yet. Start by creating your first note.
          </p>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create your first note
          </Button>
        </div>
      </div>
    </div>
  )
} 