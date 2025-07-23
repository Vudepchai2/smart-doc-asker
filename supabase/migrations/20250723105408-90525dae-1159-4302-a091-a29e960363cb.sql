-- Create workflows table to store user-defined workflows
CREATE TABLE public.workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  workflow_data JSONB NOT NULL, -- Stores the React Flow nodes and edges
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflow_executions table to store execution results
CREATE TABLE public.workflow_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  input_files JSONB, -- Store file metadata and references
  results JSONB, -- Store execution results
  execution_log TEXT[], -- Store step-by-step execution logs
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Enable Row Level Security
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;

-- Create policies for workflows
CREATE POLICY "Users can view their own workflows" 
ON public.workflows 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workflows" 
ON public.workflows 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflows" 
ON public.workflows 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflows" 
ON public.workflows 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for workflow_executions
CREATE POLICY "Users can view their own executions" 
ON public.workflow_executions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own executions" 
ON public.workflow_executions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own executions" 
ON public.workflow_executions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_workflows_updated_at
BEFORE UPDATE ON public.workflows
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_workflows_user_id ON public.workflows(user_id);
CREATE INDEX idx_workflow_executions_workflow_id ON public.workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_user_id ON public.workflow_executions(user_id);
CREATE INDEX idx_workflow_executions_status ON public.workflow_executions(status);