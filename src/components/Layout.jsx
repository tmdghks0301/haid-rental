import './Layout.css'

function Layout({ onBack, title }) {
  return (
    <header className="header">
      <button type="button" className="header-back" onClick={onBack} aria-label="뒤로">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>
      <h1 className="header-title">{title}</h1>
      <span className="header-spacer" />
    </header>
  )
}

export default Layout
