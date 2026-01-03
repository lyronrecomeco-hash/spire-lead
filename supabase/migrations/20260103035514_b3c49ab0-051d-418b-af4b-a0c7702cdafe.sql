-- Create table for Kanban statuses/columns
CREATE TABLE public.kanban_statuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  color VARCHAR NOT NULL DEFAULT 'bg-muted-foreground',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.kanban_statuses ENABLE ROW LEVEL SECURITY;

-- Full access policy (no auth required for this system)
CREATE POLICY "Full access to kanban_statuses" 
ON public.kanban_statuses 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_kanban_statuses_updated_at
BEFORE UPDATE ON public.kanban_statuses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();