import { Outlet, useLocation, Link } from 'react-router-dom'
import './Layout.css'

const PAGE_TITLES = {
  '/service/wheelchair': '예약',
  '/service/accident': '예약',
  '/reservation/wheelchair': '예약',
  '/reservation/accident': '예약',
  '/reservation-complete': '예약',
  '/reservation-status': '결제',
  '/in-use': '이용 중',
  '/use-complete': '이용 완료',
}

function Layout() {
  const location = useLocation()
  const showHeader = !['/'].includes(location.pathname)
  const pageTitle = PAGE_TITLES[location.pathname] || '헤이드 렌트카'

  return (
    <div className="layout">
      {showHeader && (
        <header className="header">
          <Link to="/" className="header-icon" aria-label="홈">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          <h1 className="header-title">{pageTitle}</h1>
          <button type="button" className="header-icon" aria-label="메뉴">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </header>
      )}
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
