import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Company = 'friends' | 'family' | 'partner' | 'colleagues'

export type Session = {
  ageConfirmed: boolean
  company: Company | null
  players: number | null
}

type SessionContextValue = Session & {
  confirmAge: () => void
  setCompany: (company: Company) => void
  setPlayers: (players: number) => void
  resetTable: () => void
}

// sessionStorage: answers survive a page refresh, but a fresh visit
// starts again at the door (so the age check is asked every visit).
const STORAGE_KEY = 'dive-session'
const emptySession: Session = { ageConfirmed: false, company: null, players: null }

function loadSession(): Session {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? { ...emptySession, ...JSON.parse(saved) } : emptySession
  } catch {
    return emptySession
  }
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(loadSession)

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch {
      // Storage unavailable (e.g. private mode) — the app still works in memory
    }
  }, [session])

  const value: SessionContextValue = {
    ...session,
    confirmAge: () => setSession((s) => ({ ...s, ageConfirmed: true })),
    // Partners are always a table of 2, so we fill that in for them
    setCompany: (company) =>
      setSession((s) => ({ ...s, company, players: company === 'partner' ? 2 : null })),
    setPlayers: (players) => setSession((s) => ({ ...s, players })),
    resetTable: () => setSession((s) => ({ ...s, company: null, players: null })),
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used inside <SessionProvider>')
  return context
}
