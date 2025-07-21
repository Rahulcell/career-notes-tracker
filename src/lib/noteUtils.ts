/**
 * Utility functions for note operations
 * Search, filter, sort, and data manipulation helpers
 */

import { Note, SearchFilters, SortOption, Priority } from '@/types/note';

/**
 * Generate a unique ID for new notes
 * Uses timestamp + random string for uniqueness
 */
export function generateNoteId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Search and filter notes based on criteria
 */
export function filterNotes(notes: Note[], filters: SearchFilters): Note[] {
  return notes.filter(note => {
    // Text search in title, content, and tags
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const searchableText = [
        note.title,
        note.content,
        ...note.tags,
        note.category,
        note.priority
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Priority filter
    if (filters.priority && note.priority !== filters.priority) {
      return false;
    }

    // Category filter
    if (filters.category && note.category !== filters.category) {
      return false;
    }

    // Favorite filter
    if (filters.isFavorite !== undefined && note.isFavorite !== filters.isFavorite) {
      return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        note.tags.some(noteTag => 
          noteTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort notes based on specified criteria
 */
export function sortNotes(notes: Note[], sortBy: SortOption): Note[] {
  const sortedNotes = [...notes];

  switch (sortBy) {
    case 'newest':
      return sortedNotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    case 'oldest':
      return sortedNotes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    case 'title':
      return sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
    
    case 'priority':
      const priorityOrder: Record<Priority, number> = { high: 3, medium: 2, low: 1 };
      return sortedNotes.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    
    default:
      return sortedNotes;
  }
}

/**
 * Extract unique tags from all notes
 */
export function getUniqueTags(notes: Note[]): string[] {
  const allTags = notes.flatMap(note => note.tags);
  return [...new Set(allTags)].sort();
}

/**
 * Parse tags from string input (comma or space separated)
 */
export function parseTags(tagsString: string): string[] {
  if (!tagsString.trim()) return [];
  
  return tagsString
    .split(/[,\s]+/)
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .map(tag => tag.toLowerCase());
}

/**
 * Format tags for display (with proper capitalization)
 */
export function formatTagsForDisplay(tags: string[]): string[] {
  return tags.map(tag => 
    tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()
  );
}

/**
 * Get note statistics
 */
export function getNoteStats(notes: Note[]) {
  const totalNotes = notes.length;
  const favoriteNotes = notes.filter(note => note.isFavorite).length;
  
  const priorityCounts = notes.reduce((acc, note) => {
    acc[note.priority] = (acc[note.priority] || 0) + 1;
    return acc;
  }, {} as Record<Priority, number>);

  const categoryCounts = notes.reduce((acc, note) => {
    acc[note.category] = (acc[note.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentNotes = notes
    .filter(note => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return note.createdAt > weekAgo;
    }).length;

  return {
    total: totalNotes,
    favorites: favoriteNotes,
    priorities: priorityCounts,
    categories: categoryCounts,
    recentNotes,
    tags: getUniqueTags(notes).length
  };
}

/**
 * Validate note data
 */
export function validateNote(note: Partial<Note>): string[] {
  const errors: string[] = [];

  if (!note.title?.trim()) {
    errors.push('Title is required');
  }

  if (!note.content?.trim()) {
    errors.push('Content is required');
  }

  if (!note.priority) {
    errors.push('Priority is required');
  }

  if (!note.category) {
    errors.push('Category is required');
  }

  return errors;
}

/**
 * Create a new note with default values
 */
export function createNewNote(data: Partial<Note> = {}): Note {
  const now = new Date();
  
  return {
    id: generateNoteId(),
    title: '',
    content: '',
    tags: [],
    priority: 'medium',
    category: 'task',
    isFavorite: false,
    createdAt: now,
    updatedAt: now,
    ...data
  };
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

/**
 * Truncate text for preview
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}