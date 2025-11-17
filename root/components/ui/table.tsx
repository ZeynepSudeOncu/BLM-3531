import * as React from "react";

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-left text-sm text-gray-700 dark:text-gray-200">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      {children}
    </thead>
  );
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">{children}</tr>;
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-gray-100 dark:divide-gray-800">{children}</tbody>;
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-2">{children}</td>;
}
