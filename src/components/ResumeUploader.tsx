import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Progress } from '@/components/ui/progress';

interface ResumeUploaderProps {
  onUploadSuccess: (url: string, skills: string[]) => void;
}

export function ResumeUploader({ onUploadSuccess }: ResumeUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const selected = acceptedFiles[0];
    if (!selected) return;
    setFile(selected);
    setIsUploading(true);
    setProgress(20);
    
    try {
      // Simulate progress
      const interval = setInterval(() => setProgress((p) => Math.min(p + 15, 90)), 200);
      const res = await api.uploadResume(selected);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        onUploadSuccess(res.url, res.extractedSkills);
        setIsUploading(false);
      }, 500);
    } catch (e) {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc', '.docx'] },
    maxFiles: 1,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50 text-muted-foreground",
          file ? "bg-muted/30" : ""
        )}
      >
        <input {...getInputProps()} />
        {isUploading ? (
          <div className="flex flex-col items-center gap-4 w-full max-w-xs">
            <UploadCloud className="h-10 w-10 text-primary animate-pulse" />
            <p className="text-sm font-medium text-foreground">Extracting experience...</p>
            <Progress value={progress} className="h-2 w-full" />
          </div>
        ) : file && progress === 100 ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
            <p className="text-sm font-medium text-foreground">{file.name} uploaded successfully!</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="h-10 w-10 mb-2 opacity-75" />
            <p className="text-sm font-medium text-foreground">
              {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
            </p>
            <p className="text-xs">PDF or Word docs up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
