// Node types for Tiptap content
interface TextNode {
  type: "text";
  text: string;
}

interface ParagraphNode {
  type: "paragraph";
  content: (TextNode)[];
}

interface DocNode {
  type: "doc";
  content: ParagraphNode[];
}

export interface Note {
  id: string;
  title: string;
  content_json: DocNode;
  html_snapshot: string;
  version: number;
  user_id: string;
  collaborators?: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateNoteInput {
  title: string;
  content_json: DocNode;
  html_snapshot: string;
}

export interface UpdateNoteInput extends CreateNoteInput {
  version: number;
  collaborators?: string[];
} 