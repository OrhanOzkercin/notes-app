import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function NotesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-cal font-semibold">My Notes</h1>
        <Button asChild>
          <Link href="/notes/create">New Note</Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is where your notes will appear. Click the &quot;New Note&quot; button to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 