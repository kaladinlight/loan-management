'use client';

import { Filter, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Input } from '@/app/components/ui/input';
import { useDebounce } from '@/app/hooks/useDebounce';
import { LOAN_PURPOSE_OPTIONS, LOAN_STATUS_OPTIONS } from '@/lib/constants';

export function LoanFilters(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialSearch = searchParams.get('search') ?? '';
  const [search, setSearch] = useState(initialSearch);
  const debouncedSearch = useDebounce(search, 300);
  const isFirstRender = useRef(true);

  const currentStatus = searchParams.get('status');
  const currentPurpose = searchParams.get('purpose');

  const activeFilters: { type: 'status' | 'purpose'; value: string; label: string }[] = [];

  if (currentStatus) {
    const statusOption = LOAN_STATUS_OPTIONS.find((o) => o.value === currentStatus);
    if (statusOption) {
      activeFilters.push({ type: 'status', value: currentStatus, label: statusOption.label });
    }
  }

  if (currentPurpose) {
    const purposeOption = LOAN_PURPOSE_OPTIONS.find((o) => o.value === currentPurpose);
    if (purposeOption) {
      activeFilters.push({ type: 'purpose', value: currentPurpose, label: purposeOption.label });
    }
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch === '') {
      params.delete('search');
    } else {
      params.set('search', debouncedSearch);
    }

    startTransition(() => {
      router.push(`/loans?${params.toString()}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const updateFilter = (type: 'status' | 'purpose', value: string | null): void => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null) {
      params.delete(type);
    } else {
      params.set(type, value);
    }

    startTransition(() => {
      router.push(`/loans?${params.toString()}`);
    });
  };

  const clearAllFilters = (): void => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('status');
    params.delete('purpose');

    startTransition(() => {
      router.push(`/loans?${params.toString()}`);
    });
  };

  const handleStatusToggle = (value: string): void => {
    updateFilter('status', currentStatus === value ? null : value);
  };

  const handlePurposeToggle = (value: string): void => {
    updateFilter('purpose', currentPurpose === value ? null : value);
  };

  const removeFilter = (type: 'status' | 'purpose'): void => {
    updateFilter(type, null);
  };

  const filterCount = activeFilters.length;

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search by borrower name or loan number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
            aria-label="Search loans"
          />
          {isPending && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {filterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {filterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            {LOAN_STATUS_OPTIONS.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={currentStatus === option.value}
                onCheckedChange={() => handleStatusToggle(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Purpose</DropdownMenuLabel>
            {LOAN_PURPOSE_OPTIONS.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={currentPurpose === option.value}
                onCheckedChange={() => handlePurposeToggle(option.value)}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center gap-2 min-h-[24px]">
        {activeFilters.length > 0 ? (
          <>
            {activeFilters.map((filter) => (
              <Badge key={`${filter.type}-${filter.value}`} variant="secondary" className="gap-1 pr-1">
                <span className="capitalize">{filter.type}:</span> {filter.label}
                <button
                  onClick={() => removeFilter(filter.type)}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                  aria-label={`Remove ${filter.type} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-6 px-2 text-xs">
              Clear all
            </Button>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">No active filters</span>
        )}
      </div>
    </div>
  );
}
