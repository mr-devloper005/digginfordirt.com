'use client'

import type { ReactNode } from 'react'
import { NavbarShell } from '@/components/shared/navbar-shell'
import { Footer } from '@/components/shared/footer'
import { getFactoryState } from '@/design/factory/get-factory-state'

export function PageShell({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
}) {
  const { recipe } = getFactoryState()
  const isCurationProduct = recipe.primaryTask === 'sbm'

  return (
    <div className={isCurationProduct ? 'archive-shell min-h-screen' : 'min-h-screen bg-background'}>
      <NavbarShell />
      <main>
        <section className={isCurationProduct ? 'border-b border-[rgba(83,96,127,0.14)] bg-transparent' : 'border-b border-border bg-secondary/30'}>
          <div className={isCurationProduct ? 'mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8' : 'mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8'}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className={isCurationProduct ? 'archive-panel archive-grid rounded-[2.2rem] p-7 sm:p-8' : ''}>
                <div className={isCurationProduct ? 'archive-kicker' : 'hidden'}>Archive surface</div>
                <h1 className={isCurationProduct ? 'mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#21283f]' : 'text-3xl font-bold text-foreground'}>{title}</h1>
                {description && (
                  <p className={isCurationProduct ? 'mt-3 max-w-2xl text-sm leading-7 text-[#53607f]' : 'mt-2 max-w-2xl text-muted-foreground'}>{description}</p>
                )}
              </div>
              {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
            </div>
          </div>
        </section>
        <section className={isCurationProduct ? 'mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8' : 'mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8'}>
          {children}
        </section>
      </main>
      <Footer />
    </div>
  )
}
