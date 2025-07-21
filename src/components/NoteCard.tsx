/**
 * NoteCard Component
 * Displays individual note in the list with all metadata
 */

import { Star, Edit, Trash2, Calendar, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Note } from '@/types/note';
import { PRIORITIES, CATEGORIES } from '@/types/note';
import { formatDate, truncateText, formatTagsForDisplay } from '@/lib/noteUtils';
import { cn } from '@/lib/utils';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete, onToggleFavorite }: NoteCardProps) {
  const priority = PRIORITIES.find(p => p.value === note.priority);
  const category = CATEGORIES.find(c => c.value === note.category);
  const formattedTags = formatTagsForDisplay(note.tags);

  return (
    <Card className="group hover:shadow-medium transition-all duration-200 border-border bg-gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {/* Priority indicator */}
              {priority && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs border-0 px-2 py-1",
                    `bg-priority-${priority.value}/10 text-priority-${priority.value}`
                  )}
                >
                  <div className={`w-2 h-2 rounded-full mr-1 bg-priority-${priority.value}`} />
                  {priority.value.toUpperCase()}
                </Badge>
              )}

              {/* Category indicator */}
              {category && (
                <Badge 
                  variant="outline"
                  className={cn(
                    "text-xs border-0 px-2 py-1",
                    `bg-category-${category.value}/10 text-category-${category.value}`
                  )}
                >
                  <div className={`w-2 h-2 rounded-full mr-1 bg-category-${category.value}`} />
                  {category.label}
                </Badge>
              )}

              {/* Favorite star */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(note.id)}
                className={cn(
                  "h-7 w-7 p-0 ml-auto opacity-60 group-hover:opacity-100 transition-opacity",
                  note.isFavorite && "text-favorite opacity-100"
                )}
              >
                <Star 
                  className={cn(
                    "w-4 h-4",
                    note.isFavorite && "fill-current"
                  )} 
                />
              </Button>
            </div>

            <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
              {note.title}
            </h3>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(note.createdAt)}</span>
              {note.updatedAt.getTime() !== note.createdAt.getTime() && (
                <span className="text-muted-foreground">• edited {formatDate(note.updatedAt)}</span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Note content preview */}
        {note.content && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {truncateText(note.content, 120)}
          </p>
        )}

        {/* Tags */}
        {formattedTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {formattedTags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                <Tag className="w-2.5 h-2.5 mr-1" />
                {tag}
              </Badge>
            ))}
            {formattedTags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                +{formattedTags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(note)}
            className="h-8 px-3 text-xs"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(note.id)}
            className="h-8 px-3 text-xs text-destructive hover:text-destructive"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}