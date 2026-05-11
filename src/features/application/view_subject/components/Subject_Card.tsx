import type { Subject } from "../../../../utils/interfaces/subject.interface";

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-lavender bg-app-bg transition-colors">
        📘
      </div>
      <div className="flex-1">
        <h3 className="mb-2 text-xl font-semibold text-purple-primary">
          {subject.name}
        </h3>
        <p className="text-sm text-text-dark/70">{subject.description}</p>
      </div>
    </div>
  );
}
