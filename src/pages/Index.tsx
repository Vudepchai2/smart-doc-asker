
import React from 'react';
import { DocumentationHeader } from '@/components/DocumentationHeader';
import { WorkflowCanvas } from '@/components/WorkflowCanvas';

const Index = () => {
  return (
    <div className="h-screen bg-background">
      <DocumentationHeader />
      <WorkflowCanvas />
    </div>
  );
};

export default Index;
