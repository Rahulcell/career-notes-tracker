/**
 * NotesHeader Component
 * Main header with app title, stats, and primary actions
 */

import { Plus, Search, Filter, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Note } from '@/types/note';
import { getNoteStats } from '@/lib/noteUtils';

interface NotesHeaderProps {
  notes: Note[];
  onCreateNote: () => void;
  onToggleSearch: () => void;
  showSearch: boolean;
}

export function NotesHeader({ 
  notes, 
  onCreateNote, 
  onToggleSearch, 
  showSearch 
}: NotesHeaderProps) {
  const stats = getNoteStats(notes);

  return (
    <header className="bg-gradient-card border-b border-border p-6 shadow-soft">
      <div className="max-w-7xl mx-auto">
        {/* Main title and actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Progress Notes</h1>
                <p className="text-sm text-muted-foreground">Track your internship journey</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleSearch}
              className={showSearch ? "bg-primary text-primary-foreground" : ""}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            
            <Button onClick={onCreateNote} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>

        {/* Stats display */}
        <div className="flex flex-wrap gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <span className="font-medium">{stats.total}</span>
            <span className="ml-1 text-muted-foreground">total notes</span>
          </Badge>
          
          {stats.favorites > 0 && (
            <Badge variant="outline" className="px-3 py-1">
              <span className="font-medium">{stats.favorites}</span>
              <span className="ml-1 text-muted-foreground">favorites</span>
            </Badge>
          )}
          
          {stats.recentNotes > 0 && (
            <Badge variant="outline" className="px-3 py-1">
              <span className="font-medium">{stats.recentNotes}</span>
              <span className="ml-1 text-muted-foreground">this week</span>
            </Badge>
          )}

          {Object.entries(stats.priorities).map(([priority, count]) => (
            count > 0 && (
              <Badge key={priority} variant="outline" className="px-3 py-1">
                <div className={`w-2 h-2 rounded-full mr-2 bg-priority-${priority}`} />
                <span className="font-medium">{count}</span>
                <span className="ml-1 text-muted-foreground">{priority}</span>
              </Badge>
            )
          ))}
        </div>
      </div>
    </header>
  );
}