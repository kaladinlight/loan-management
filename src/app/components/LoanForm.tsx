'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { BaseSyntheticEvent } from 'react';
import { startTransition, useActionState } from 'react';
import { type Resolver, useForm, useWatch } from 'react-hook-form';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { type LoanFormData, loanSchema } from '@/lib/schemas/loan';
import type { ActionState, Loan } from '@/lib/types';

const PURPOSE_OPTIONS = [
  { value: 'PERSONAL', label: 'Personal' },
  { value: 'MORTGAGE', label: 'Mortgage' },
  { value: 'AUTO', label: 'Auto' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'OTHER', label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAID', label: 'Paid' },
  { value: 'DEFAULTED', label: 'Defaulted' },
];

interface LoanFormProps {
  loan?: Loan;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
}

export function LoanForm({ loan, action, submitLabel }: LoanFormProps): React.ReactElement {
  const [state, formAction, isPending] = useActionState(action, { success: true });

  const formatDateForInput = (date: Date | string | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const getDefaultValues = (): Partial<LoanFormData> | undefined => {
    if (!loan) return undefined;
    const parsed = loanSchema.parse(loan);
    return {
      ...parsed,
      startDate: formatDateForInput(parsed.startDate) as unknown as Date,
    };
  };

  const {
    control,
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema) as Resolver<LoanFormData>,
    defaultValues: getDefaultValues(),
    mode: 'onTouched',
  });

  const onSubmit = (_data: LoanFormData, event?: BaseSyntheticEvent): void => {
    if (event?.target) {
      const formData = new FormData(event.target as HTMLFormElement);
      startTransition(() => {
        formAction(formData);
      });
    }
  };

  const purposeValue = useWatch({ control, name: 'purpose' });
  const statusValue = useWatch({ control, name: 'status' });

  const getFieldError = (field: string): string | undefined => {
    const clientError = errors[field as keyof LoanFormData]?.message;
    const serverError = state.fieldErrors?.[field]?.[0];
    return clientError ?? serverError;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{loan ? `Loan ${loan.loanNumber}` : 'Create New Loan'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="borrowerName">Borrower Name</Label>
              <Input
                id="borrowerName"
                {...register('borrowerName')}
                placeholder="Full name"
                aria-describedby={getFieldError('borrowerName') ? 'borrowerName-error' : undefined}
              />
              {getFieldError('borrowerName') && (
                <p id="borrowerName-error" className="text-sm text-destructive">
                  {getFieldError('borrowerName')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="borrowerEmail">Borrower Email</Label>
              <Input
                id="borrowerEmail"
                type="email"
                {...register('borrowerEmail')}
                placeholder="email@example.com"
                aria-describedby={getFieldError('borrowerEmail') ? 'borrowerEmail-error' : undefined}
              />
              {getFieldError('borrowerEmail') && (
                <p id="borrowerEmail-error" className="text-sm text-destructive">
                  {getFieldError('borrowerEmail')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <input type="hidden" {...register('purpose')} />
              <Select
                value={purposeValue}
                onValueChange={(value) => setValue('purpose', value as LoanFormData['purpose'])}
              >
                <SelectTrigger id="purpose" aria-describedby={getFieldError('purpose') ? 'purpose-error' : undefined}>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {PURPOSE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError('purpose') && (
                <p id="purpose-error" className="text-sm text-destructive">
                  {getFieldError('purpose')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <input type="hidden" {...register('status')} />
              <Select
                value={statusValue}
                onValueChange={(value) => setValue('status', value as LoanFormData['status'])}
              >
                <SelectTrigger id="status" aria-describedby={getFieldError('status') ? 'status-error' : undefined}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError('status') && (
                <p id="status-error" className="text-sm text-destructive">
                  {getFieldError('status')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                {...register('amount')}
                placeholder="0.00"
                aria-describedby={getFieldError('amount') ? 'amount-error' : undefined}
              />
              {getFieldError('amount') && (
                <p id="amount-error" className="text-sm text-destructive">
                  {getFieldError('amount')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...register('interestRate')}
                placeholder="0.00"
                aria-describedby={getFieldError('interestRate') ? 'interestRate-error' : undefined}
              />
              {getFieldError('interestRate') && (
                <p id="interestRate-error" className="text-sm text-destructive">
                  {getFieldError('interestRate')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Term (months)</Label>
              <Input
                id="term"
                type="number"
                min="1"
                max="360"
                {...register('term')}
                placeholder="12"
                aria-describedby={getFieldError('term') ? 'term-error' : undefined}
              />
              {getFieldError('term') && (
                <p id="term-error" className="text-sm text-destructive">
                  {getFieldError('term')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                aria-describedby={getFieldError('startDate') ? 'startDate-error' : undefined}
              />
              {getFieldError('startDate') && (
                <p id="startDate-error" className="text-sm text-destructive">
                  {getFieldError('startDate')}
                </p>
              )}
            </div>
          </div>

          {state.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</div>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
