import ReactDiffViewer from 'react-diff-viewer-continued';
import { ScrollArea } from './ui/scroll-area';

interface DocumentPreviewProps {
  original: string;
  tailored: string;
}

export function DocumentPreview({ original, tailored }: DocumentPreviewProps) {
  // Check if dark mode is active by looking at HTML class in a real app
  const isDark = document.documentElement.classList.contains('dark');
  
  return (
    <ScrollArea className="h-full w-full rounded-md border">
      <div className="min-w-[800px] p-4 text-sm">
        <ReactDiffViewer 
          oldValue={original} 
          newValue={tailored} 
          splitView={true} 
          useDarkTheme={isDark}
          leftTitle="Original Resume"
          rightTitle="Tailored for this Job"
          hideLineNumbers={true}
          styles={{
            variables: {
              dark: {
                diffViewerBackground: '#09090b', // zinc-950
                addedBackground: '#14301d',      // green-900/50
                addedColor: '#4ade80',           // green-400
                removedBackground: '#451a1d',    // red-900/50
                removedColor: '#f87171',         // red-400
              }
            }
          }}
        />
      </div>
    </ScrollArea>
  );
}
