'use client';

import { Button } from "@/components/ui/button";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useCreateNote } from "@/hooks/use-create-note";
import { Input } from "@/components/ui/input";

export default function CreateNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { mutate: createNote, isPending } = useCreateNote();

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      return;
    }
    console.log(content);
    
    createNote({
      title: title.trim(),
      content_json: content,
      html_snapshot: content, // For now, we'll use the same content as snapshot
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/notes" className="flex items-center gap-2 text-foreground hover:text- transition-colors">
          <ChevronLeft size={24} aria-hidden="true" className="mt-1" />
          <span className="sr-only">Back to notes</span>
        </Link>
        <h1 className="text-4xl font-cal font-semibold">Create New Note</h1>
      </div>

      <div className="space-y-6">
        <div>
          <Input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-cal"
          />
        </div>

        <TiptapEditor
          content={content}
          onChange={handleContentChange}
          placeholder="Start writing your note..."
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/notes">Cancel</Link>
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isPending || !title.trim()}
          >
            {isPending ? 'Saving...' : 'Save Note'}
          </Button>
        </div>
      </div>
    </div>
  );
} 