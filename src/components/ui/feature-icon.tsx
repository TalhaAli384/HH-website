import {
  Award,
  BadgeDollarSign,
  Clock,
  Handshake,
  HardHat,
  Leaf,
  Lightbulb,
  ShieldCheck,
  Users,
  type LucideProps,
} from "lucide-react";

const icons = { Award, BadgeDollarSign, Clock, Handshake, HardHat, Leaf, Lightbulb, ShieldCheck, Users };

export function FeatureIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name as keyof typeof icons] ?? ShieldCheck;
  return <Icon {...props} />;
}
