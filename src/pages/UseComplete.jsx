import './UseComplete.css'

function UseComplete({ data, onHome }) {
  if (!data) return <div className="loading">로딩 중...</div>

  return (
    <div className="use-complete">
      <div className="complete-icon">✓</div>
      <h1 className="complete-title">이용이 완료되었습니다</h1>
      <p className="complete-desc">이용해 주셔서 감사합니다.</p>

      <section className="summary-section">
        <h2 className="section-label">이용 요약 정보</h2>
        <ul className="summary-list">
          <li><span className="label">차량</span><span className="value">{data.car}</span></li>
          <li><span className="label">이용 형태</span><span className="value">{data.usageType}</span></li>
          <li><span className="label">이용 기간</span><span className="value">{data.duration || '-'}</span></li>
          <li><span className="label">이용 요금</span><span className="value">{data.estimatedPrice}</span></li>
          <li><span className="label">보험</span><span className="value">{data.insurance}</span></li>
        </ul>
      </section>

      <button type="button" className="cta-button" onClick={onHome}>
        홈으로
      </button>
    </div>
  )
}

export default UseComplete
