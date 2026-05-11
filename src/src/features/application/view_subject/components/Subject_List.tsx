import { AnimatePresence, motion } from "framer-motion";
import type { Subject } from "../../../../utils/interfaces/subject.interface";
import { SubjectCard } from "./Subject_Card";

interface SubjectListProps {
  subjects: Subject[];
  onCardClick?: (subject: Subject) => void;
}

export function SubjectList({ subjects, onCardClick }: SubjectListProps) {
  return (
    <AnimatePresence>
      {subjects.map((s) => (
        <motion.div
          key={s.id}
          onClick={() => onCardClick?.(s)}
          className="group cursor-pointer border-2 rounded-2xl border-lavender bg-white p-6 transition-all hover:border-purple-light hover:shadow-[0_4px_16px_rgba(109,40,217,0.15)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <SubjectCard subject={s} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
