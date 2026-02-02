import './InUse.css'

function InUse({ data, onExtend, onReturn }) {
  if (!data) return <div className="loading">로딩 중...</div>

  return (
    <div className="in-use">
      <div className="in-use-header">
        <span className="remaining-badge">이용시간 3시간 남음</span>
        <span className="return-time">반납 시각 22:00</span>
      </div>
      <p className="return-deadline">22시 00분까지 반납입니다.</p>

      <section className="vehicle-section">
        <div className="vehicle-image" />
        <p className="vehicle-name">{data.car || '차량'} · 123하1234</p>
      </section>

      <section className="usage-details">
        <h3 className="details-heading">예약 정보</h3>
        <ul className="details-list">
          <li><span className="label">이용 형태</span><span className="value">{data.usageType}</span></li>
          <li><span className="label">이용 요금</span><span className="value">{data.estimatedPrice}</span></li>
          <li><span className="label">보험</span><span className="value">{data.insurance}</span></li>
        </ul>
      </section>

      <section className="return-info">
        <div className="return-item">
          <span className="return-icon">📍</span>
          <div>
            <span className="return-label">반납 장소</span>
            <span className="return-value">{data.returnLocation || '라임프렌즈 주차장'}</span>
          </div>
        </div>
      </section>

      <div className="action-buttons">
        <button type="button" className="btn-extend" onClick={onExtend}>
          연장하기
        </button>
        <button type="button" className="cta-button btn-return" onClick={onReturn}>
          반납하기
        </button>
      </div>
      <p className="in-use-notice">연장은 상담 후 확정됩니다. 반납 요청 시 이용 완료 처리됩니다.</p>
    </div>
  )
}

export default InUse
