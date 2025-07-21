/**
 * NotesApp Main Component
 * Orchestrates the entire notes application with state management
 */

import { useState, useEffect } from 'react';
import { Trash2, Download, Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { NotesHeader } from './NotesHeader';
import { SearchAndFilter } from './SearchAndFilter';
import { NotesList } from './NotesList';
import { NoteForm } from './NoteForm';
import { Note, SearchFilters, SortOption } from '@/types/note';
import { noteStorage, storageUtils } from '@/lib/noteStorage';
import { filterNotes, sortNotes, createNewNote } from '@/lib/noteUtils';

export function NotesApp() {
  // Core state
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI state
  const [showSearch, setShowSearch] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Search and filter state
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    priority: undefined,
    category: undefined,
    isFavorite: undefined,
    tags: undefined
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  const { toast } = useToast();

  // Load notes from storage on mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setIsLoading(true);
        
        // Check if storage is available
        if (!storageUtils.isStorageAvailable()) {
          toast({
            title: "Storage Unavailable",
            description: "Local storage is not available. Notes will not be saved.",
            variant: "destructive"
          });
          return;
        }

        const storedNotes = noteStorage.getAllNotes();
        setNotes(storedNotes);
        
        // Load sample data if no notes exist
        if (storedNotes.length === 0) {
          loadSampleData();
        }
      } catch (error) {
        console.error('Failed to load notes:', error);
        toast({
          title: "Error Loading Notes",
          description: "Failed to load your notes. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, [toast]);

  // Update filtered notes when notes, filters, or sort changes
  useEffect(() => {
    let result = filterNotes(notes, searchFilters);
    result = sortNotes(result, sortBy);
    setFilteredNotes(result);
  }, [notes, searchFilters, sortBy]);

  // Load sample data for first-time users
  const loadSampleData = () => {
    const sampleNotes: Note[] = [
      {
        ...createNewNote(),
        title: "Welcome to Progress Notes! 🎉",
        content: "This is your personal notes app to track your internship journey. You can create, edit, and organize notes with priorities, categories, and tags.\n\nTry editing this note or creating a new one!",
        priority: "high",
        category: "learning",
        tags: ["welcome", "getting-started"],
        isFavorite: true
      },
      {
        ...createNewNote(),
        title: "Bug: Login form validation",
        content: "Found an issue with the login form where empty passwords are accepted. Need to add client-side validation before submitting.\n\nSteps to reproduce:\n1. Go to login page\n2. Enter email only\n3. Click submit\n4. Form submits without password",
        priority: "high",
        category: "bug",
        tags: ["frontend", "validation", "urgent"]
      },
      {
        ...createNewNote(),
        title: "Learning: React Hooks Best Practices",
        content: "Key takeaways from today's code review:\n\n• Use useCallback for functions passed to child components\n• useMemo for expensive calculations only\n• Custom hooks for reusable stateful logic\n• Keep effects focused and use cleanup functions",
        priority: "medium",
        category: "learning",
        tags: ["react", "hooks", "best-practices"],
        isFavorite: true
      }
    ];

    sampleNotes.forEach(note => noteStorage.saveNote(note));
    setNotes(sampleNotes);
    
    toast({
      title: "Welcome! 👋",
      description: "We've added some sample notes to get you started.",
    });
  };

  // Note operations
  const handleCreateNote = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleSaveNote = (note: Note) => {
    try {
      noteStorage.saveNote(note);
      
      // Update notes list
      const updatedNotes = notes.some(n => n.id === note.id)
        ? notes.map(n => n.id === note.id ? note : n)
        : [...notes, note];
      
      setNotes(updatedNotes);
      
      toast({
        title: editingNote ? "Note Updated" : "Note Created",
        description: `"${note.title}" has been ${editingNote ? 'updated' : 'created'} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteNote = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    // Confirm deletion for important notes
    if (note.priority === 'high' || note.isFavorite) {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${note.title}"? This note is marked as ${
          note.priority === 'high' ? 'high priority' : 'favorite'
        }.`
      );
      if (!confirmed) return;
    }

    try {
      noteStorage.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
      
      toast({
        title: "Note Deleted",
        description: `"${note.title}" has been deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleFavorite = (id: string) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    const updatedNote = { ...note, isFavorite: !note.isFavorite, updatedAt: new Date() };
    handleSaveNote(updatedNote);
  };

  // Search and filter handlers
  const handleToggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      // Reset filters when closing search
      setSearchFilters({
        query: '',
        priority: undefined,
        category: undefined,
        isFavorite: undefined,
        tags: undefined
      });
    }
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchFilters({
      query: '',
      priority: undefined,
      category: undefined,
      isFavorite: undefined,
      tags: undefined
    });
  };

  // Data management
  const handleExportNotes = () => {
    try {
      const dataStr = JSON.stringify(notes, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `notes-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Your notes have been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export notes. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <NotesHeader
        notes={notes}
        onCreateNote={handleCreateNote}
        onToggleSearch={handleToggleSearch}
        showSearch={showSearch}
      />

      {/* Search and Filter */}
      {showSearch && (
        <SearchAndFilter
          filters={searchFilters}
          onFiltersChange={setSearchFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
          notes={notes}
          onClose={handleCloseSearch}
        />
      )}

      {/* Main content */}
      <main className="pb-8">
        <NotesList
          notes={filteredNotes}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
          onToggleFavorite={handleToggleFavorite}
          onCreateNote={handleCreateNote}
          isLoading={isLoading}
        />
      </main>

      {/* Note Form Modal */}
      <NoteForm
        note={editingNote}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
      />

      {/* Floating action buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handleExportNotes}
          className="shadow-strong bg-card"
          title="Export notes"
        >
          <Download className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={handleCreateNote}
          size="icon"
          className="shadow-strong bg-gradient-primary"
          title="Create new note"
        >
          <span className="text-xl">+</span>
        </Button>
      </div>
    </div>
  );
}