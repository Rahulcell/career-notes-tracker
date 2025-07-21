/**
 * Core types for the Notes Application
 * Defines the structure for notes, categories, and related data
 */

export type Priority = 'high' | 'medium' | 'low';

export type Category = 'bug' | 'task' | 'learning' | 'meeting' | 'feedback';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  priority: Priority;
  category: Category;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteFormData {
  title: string;
  content: string;
  tags: string;
  priority: Priority;
  category: Category;
  isFavorite: boolean;
}

export interface SearchFilters {
  query: string;
  priority?: Priority;
  category?: Category;
  isFavorite?: boolean;
  tags?: string[];
}

export type SortOption = 'newest' | 'oldest' | 'title' | 'priority';

export const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: 'High Priority', color: 'priority-high' },
  { value: 'medium', label: 'Medium Priority', color: 'priority-medium' },
  { value: 'low', label: 'Low Priority', color: 'priority-low' },
];

export const CATEGORIES: { value: Category; label: string; color: string; icon: string }[] = [
  { value: 'bug', label: 'Bug', color: 'category-bug', icon: 'Bug' },
  { value: 'task', label: 'Task', color: 'category-task', icon: 'CheckSquare' },
  { value: 'learning', label: 'Learning', color: 'category-learning', icon: 'BookOpen' },
  { value: 'meeting', label: 'Meeting', color: 'category-meeting', icon: 'Users' },
  { value: 'feedback', label: 'Feedback', color: 'category-feedback', icon: 'MessageSquare' },
];