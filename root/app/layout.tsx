import '../style/global.css';
import { Toaster } from 'sonner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="tr">
<body className="min-h-screen bg-gray-50 text-gray-900">
<Toaster richColors position="top-center" />
{children}
</body>
</html>
);
}