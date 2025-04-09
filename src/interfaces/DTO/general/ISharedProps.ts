export interface EnumSelectProps<T extends Record<string, string | number>> {
 readonly enumObject: T;
 readonly name: string;
 readonly value?: string | number | null; // Tornar value opcional
 readonly onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
 readonly descriptionsMap: Record<number | string, string>;
 readonly label?: string;
 readonly required?: boolean;
 readonly invalidFeedback?: string;
 readonly className?: string;
}