/**
 * NoteForm Component
 * Rich form for creating and editing notes with validation
 */

import { useState, useEffect } from 'react';
import { Save, X, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Note, NoteFormData, Priority, Category } from '@/types/note';
import { PRIORITIES, CATEGORIES } from '@/types/note';
import { parseTags, validateNote } from '@/lib/noteUtils';
import { cn } from '@/lib/utils';

interface NoteFormProps {
  note?: Note;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
}

export function NoteForm({ note, isOpen, onClose, onSave }: NoteFormProps) {
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    tags: '',
    priority: 'medium',
    category: 'task',
    isFavorite: false
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with note data when editing
  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        tags: note.tags.join(', '),
        priority: note.priority,
        category: note.category,
        isFavorite: note.isFavorite
      });
    } else {
      // Reset form for new note
      setFormData({
        title: '',
        content: '',
        tags: '',
        priority: 'medium',
        category: 'task',
        isFavorite: false
      });
    }
    setErrors([]);
  }, [note, isOpen]);

  const updateFormData = (updates: Partial<NoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSave = async () => {
    // Validate form data
    const parsedTags = parseTags(formData.tags);
    const noteToValidate = {
      ...formData,
      tags: parsedTags
    };
    
    const validationErrors = validateNote(noteToValidate);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const now = new Date();
      const savedNote: Note = {
        id: note?.id || `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: parsedTags,
        priority: formData.priority,
        category: formData.category,
        isFavorite: formData.isFavorite,
        createdAt: note?.createdAt || now,
        updatedAt: now
      };

      onSave(savedNote);
      onClose();
    } catch (error) {
      setErrors(['Failed to save note. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const parsedTags = parseTags(formData.tags);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {note ? 'Edit Note' : 'Create New Note'}
            {formData.isFavorite && (
              <Star className="w-4 h-4 text-favorite fill-current" />
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Error display */}
          {errors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <ul className="text-sm text-destructive space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter note title..."
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              className="text-lg"
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground">
              {formData.title.length}/100 characters
            </div>
          </div>

          {/* Priority and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority *</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: Priority) => updateFormData({ priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-priority-${priority.value}`} />
                        {priority.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: Category) => updateFormData({ category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-category-${category.value}`} />
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Favorite toggle */}
          <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Star className={cn(
                "w-4 h-4",
                formData.isFavorite ? "text-favorite fill-current" : "text-muted-foreground"
              )} />
              <Label htmlFor="favorite" className="text-sm font-medium cursor-pointer">
                Mark as favorite
              </Label>
            </div>
            <Switch
              id="favorite"
              checked={formData.isFavorite}
              onCheckedChange={(checked) => updateFormData({ isFavorite: checked })}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium">
              Tags
            </Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas..."
              value={formData.tags}
              onChange={(e) => updateFormData({ tags: e.target.value })}
            />
            <div className="text-xs text-muted-foreground">
              Separate multiple tags with commas (e.g., "bug, urgent, frontend")
            </div>
            
            {/* Tag preview */}
            {parsedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {parsedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Content *
            </Label>
            <Textarea
              id="content"
              placeholder="Write your note content here..."
              value={formData.content}
              onChange={(e) => updateFormData({ content: e.target.value })}
              className="min-h-40 resize-y"
              maxLength={5000}
            />
            <div className="text-xs text-muted-foreground">
              {formData.content.length}/5000 characters
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : (note ? 'Update Note' : 'Create Note')}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}