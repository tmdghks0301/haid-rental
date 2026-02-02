import './Layout.css'

function Layout({ onBack, onHome, title }) {
  return (
    <header className="header">
      <button type="button" className="header-back" onClick={onBack} aria-label="뒤로">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>
      <h1 className="header-title">{title}</h1>
      <button type="button" className="header-home" onClick={onHome} aria-label="홈">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </button>
    </header>
  )
}

export default Layout
