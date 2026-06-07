import { ReactNode } from 'react'
import { PublicNav } from '@/components/layout/PublicNav'

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black">
      <PublicNav />
      <main className="pt-14">{children}</main>
    </div>
  )
}
