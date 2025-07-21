/**
 * NotesList Component
 * Main container for displaying filtered and sorted notes
 */

import { useState } from 'react';
import { FileText, Sparkles, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NoteCard } from './NoteCard';
import { Note } from '@/types/note';
import { cn } from '@/lib/utils';

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCreateNote: () => void;
  isLoading?: boolean;
}

export function NotesList({
  notes,
  onEdit,
  onDelete,
  onToggleFavorite,
  onCreateNote,
  isLoading = false
}: NotesListProps) {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No notes found
            </h3>
            
            <p className="text-muted-foreground mb-6 max-w-md">
              Start building your knowledge base by creating your first note. 
              Track your progress, capture insights, and organize your thoughts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={onCreateNote} size="lg" className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Note
              </Button>
              
              <Button variant="outline" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                View Examples
              </Button>
            </div>

            {/* Quick tips */}
            <div className="mt-8 p-4 bg-muted/50 rounded-lg text-left max-w-md">
              <h4 className="font-medium text-sm mb-2">💡 Quick Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use tags to organize related notes</li>
                <li>• Set priorities to focus on important items</li>
                <li>• Star notes to mark them as favorites</li>
                <li>• Use categories like Bug, Task, Learning</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Notes count and view options */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            {notes.length} {notes.length === 1 ? 'note' : 'notes'}
          </h2>
          
          {notes.some(note => note.isFavorite) && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-favorite" />
              {notes.filter(note => note.isFavorite).length} favorited
            </div>
          )}
        </div>

        {/* View options could go here in the future */}
        <div className="flex items-center gap-2">
          {/* Grid/List view toggle, compact view, etc. */}
        </div>
      </div>

      {/* Notes grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map(note => (
          <div
            key={note.id}
            className={cn(
              "transition-all duration-200",
              selectedNoteId === note.id && "scale-105 z-10"
            )}
            onMouseEnter={() => setSelectedNoteId(note.id)}
            onMouseLeave={() => setSelectedNoteId(null)}
          >
            <NoteCard
              note={note}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
      </div>

      {/* Load more or pagination could go here */}
      {notes.length > 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Showing all {notes.length} notes
          </p>
        </div>
      )}
    </div>
  );
}