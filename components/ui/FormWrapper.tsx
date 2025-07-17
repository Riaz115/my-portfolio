import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Loader2 } from 'lucide-react';

interface FormWrapperProps {
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const FormWrapper: React.FC<FormWrapperProps> = ({ onSubmit, loading, children, title, className }) => {
  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {children}
          {loading && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}; 