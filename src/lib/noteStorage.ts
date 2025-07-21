/**
 * Local Storage utilities for Notes
 * Handles persistence and retrieval of notes data
 * Designed to be easily replaceable with backend API calls
 */

import { Note, Category } from '@/types/note';

const NOTES_STORAGE_KEY = 'notes-app-data';
const CATEGORIES_STORAGE_KEY = 'notes-app-categories';

// Default categories that come with the app
const DEFAULT_CATEGORIES: Category[] = ['bug', 'task', 'learning', 'meeting', 'feedback'];

/**
 * Notes Storage Operations
 */
export const noteStorage = {
  // Get all notes from localStorage
  getAllNotes(): Note[] {
    try {
      const stored = localStorage.getItem(NOTES_STORAGE_KEY);
      if (!stored) return [];
      
      const notes = JSON.parse(stored);
      // Convert date strings back to Date objects
      return notes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to load notes from storage:', error);
      return [];
    }
  },

  // Save a single note (create or update)
  saveNote(note: Note): void {
    try {
      const notes = this.getAllNotes();
      const existingIndex = notes.findIndex(n => n.id === note.id);
      
      if (existingIndex >= 0) {
        notes[existingIndex] = note;
      } else {
        notes.push(note);
      }
      
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save note:', error);
      throw new Error('Failed to save note');
    }
  },

  // Delete a note by ID
  deleteNote(id: string): void {
    try {
      const notes = this.getAllNotes();
      const filteredNotes = notes.filter(note => note.id !== id);
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filteredNotes));
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw new Error('Failed to delete note');
    }
  },

  // Get a single note by ID
  getNoteById(id: string): Note | null {
    const notes = this.getAllNotes();
    return notes.find(note => note.id === id) || null;
  },

  // Bulk operations for data management
  importNotes(notes: Note[]): void {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to import notes:', error);
      throw new Error('Failed to import notes');
    }
  },

  // Clear all notes (useful for testing or data reset)
  clearAllNotes(): void {
    localStorage.removeItem(NOTES_STORAGE_KEY);
  }
};

/**
 * Categories Storage Operations
 * Currently uses default categories, but extensible for user-defined categories
 */
export const categoryStorage = {
  // Get all available categories
  getAllCategories(): Category[] {
    try {
      const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch (error) {
      console.error('Failed to load categories:', error);
      return DEFAULT_CATEGORIES;
    }
  },

  // Add a new category (for future extensibility)
  addCategory(category: Category): void {
    try {
      const categories = this.getAllCategories();
      if (!categories.includes(category)) {
        categories.push(category);
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
      }
    } catch (error) {
      console.error('Failed to add category:', error);
    }
  }
};

/**
 * Utility functions for data validation and migration
 */
export const storageUtils = {
  // Check if storage is available
  isStorageAvailable(): boolean {
    try {
      const test = 'storage-test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },

  // Get storage usage stats
  getStorageStats() {
    const notes = noteStorage.getAllNotes();
    const totalSize = JSON.stringify(notes).length;
    
    return {
      totalNotes: notes.length,
      storageSize: `${(totalSize / 1024).toFixed(2)} KB`,
      favoriteNotes: notes.filter(n => n.isFavorite).length,
      notesByCategory: notes.reduce((acc, note) => {
        acc[note.category] = (acc[note.category] || 0) + 1;
        return acc;
      }, {} as Record<Category, number>)
    };
  }
};