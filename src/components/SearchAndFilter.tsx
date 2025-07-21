/**
 * SearchAndFilter Component
 * Advanced search and filtering interface for notes
 */

import { useState } from 'react';
import { Search, X, Filter, Star, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { SearchFilters, SortOption, Note, Priority, Category } from '@/types/note';
import { PRIORITIES, CATEGORIES } from '@/types/note';
import { getUniqueTags } from '@/lib/noteUtils';

interface SearchAndFilterProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  notes: Note[];
  onClose: () => void;
}

export function SearchAndFilter({
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  notes,
  onClose
}: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const uniqueTags = getUniqueTags(notes);

  const updateFilters = (updates: Partial<SearchFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: '',
      priority: undefined,
      category: undefined,
      isFavorite: undefined,
      tags: undefined
    });
  };

  const hasActiveFilters = 
    filters.priority || 
    filters.category || 
    filters.isFavorite !== undefined || 
    (filters.tags && filters.tags.length > 0);

  const addTagFilter = (tag: string) => {
    const currentTags = filters.tags || [];
    if (!currentTags.includes(tag)) {
      updateFilters({ tags: [...currentTags, tag] });
    }
  };

  const removeTagFilter = (tag: string) => {
    const currentTags = filters.tags || [];
    updateFilters({ tags: currentTags.filter(t => t !== tag) });
  };

  return (
    <div className="bg-card border-b border-border p-4 shadow-soft">
      <div className="max-w-7xl mx-auto">
        {/* Search bar and main controls */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notes, tags, content..."
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={hasActiveFilters ? "bg-primary text-primary-foreground" : ""}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    !
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 px-2"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <Separator />

                {/* Priority filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select 
                    value={filters.priority || ""} 
                    onValueChange={(value) => updateFilters({ priority: (value as Priority) || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any priority</SelectItem>
                      {PRIORITIES.map(priority => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full bg-${priority.color}`} />
                            {priority.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select 
                    value={filters.category || ""} 
                    onValueChange={(value) => updateFilters({ category: (value as Category) || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any category</SelectItem>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full bg-${category.color}`} />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Favorites filter */}
                <div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant={filters.isFavorite === true ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilters({ 
                        isFavorite: filters.isFavorite === true ? undefined : true 
                      })}
                      className="flex-1"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Favorites only
                    </Button>
                  </div>
                </div>

                {/* Tags filter */}
                {uniqueTags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags</label>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                      {uniqueTags.map(tag => {
                        const isSelected = filters.tags?.includes(tag);
                        return (
                          <Button
                            key={tag}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => isSelected ? removeTagFilter(tag) : addTagFilter(tag)}
                            className="h-7 text-xs"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.priority && (
              <Badge variant="outline" className="gap-1">
                <div className={`w-2 h-2 rounded-full bg-priority-${filters.priority}`} />
                {filters.priority} priority
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilters({ priority: undefined })}
                />
              </Badge>
            )}
            
            {filters.category && (
              <Badge variant="outline" className="gap-1">
                <div className={`w-2 h-2 rounded-full bg-category-${filters.category}`} />
                {filters.category}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilters({ category: undefined })}
                />
              </Badge>
            )}
            
            {filters.isFavorite && (
              <Badge variant="outline" className="gap-1">
                <Star className="w-3 h-3" />
                Favorites
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => updateFilters({ isFavorite: undefined })}
                />
              </Badge>
            )}
            
            {filters.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="gap-1">
                <Tag className="w-3 h-3" />
                {tag}
                <X 
                  className="w-3 h-3 ml-1 cursor-pointer" 
                  onClick={() => removeTagFilter(tag)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}