import { clsx } from 'clsx';
export function Card({ className, children }: { className?: string, children: React.ReactNode }) {
return <div className={clsx('rounded-2xl border bg-white shadow-sm', className)}>{children}</div>;
}
