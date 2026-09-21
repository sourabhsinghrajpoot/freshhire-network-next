import './globals.css'; import type { Metadata } from 'next';
export const metadata: Metadata = { title:'FreshHire Network | Find Your First Tech Job', description:'Fresher-friendly tech jobs with official company application links.' };
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
