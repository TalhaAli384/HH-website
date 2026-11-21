import {
  Building2,
  ClipboardList,
  Columns3,
  Factory,
  Hammer,
  HardHat,
  Home,
  KeyRound,
  Landmark,
  PencilRuler,
  Ruler,
  Sofa,
  type LucideProps,
} from "lucide-react";

const icons = { Building2, ClipboardList, Columns3, Factory, Hammer, HardHat, Home, KeyRound, Landmark, PencilRuler, Ruler, Sofa };

export function ServiceIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name as keyof typeof icons] ?? Building2;
  return <Icon {...props} />;
}
