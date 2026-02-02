import './LicenseEntry.css'

function LicenseEntry({ onDirectInput, onCamera }) {
  const handleAgreement = () => {
    // 상세 약관 페이지/모달로 이동 (추후 구현)
    alert('고유식별정보 수집 및 이용동의 약관을 확인합니다.')
  }

  return (
    <div className="license-entry-page">
      <h2 className="license-entry-title">면허정보</h2>
      <p className="license-entry-desc">
        운전가능여부 확인을 위해 본인의 운전면허증이 필요해요!
      </p>

      <button type="button" className="license-entry-agreement" onClick={handleAgreement}>
        <span className="agreement-check">✓</span>
        <span className="agreement-label">필수</span>
        <span className="agreement-text">고유식별정보 수집 및 이용동의</span>
        <span className="agreement-arrow">›</span>
      </button>

      <div className="license-entry-notices">
        <p className="notice-item">
          <span className="notice-icon">ⓘ</span>
          타인의 운전면허증 등록 시, 법적인 문제가 생길 수 있으니 반드시 본인의 면허증을 준비해 주세요.
        </p>
        <p className="notice-item">
          <span className="notice-icon">ⓘ</span>
          운전면허 재발급으로 인해 취득기간이 1년 미만이 된 경우 고객센터로 연락 부탁드립니다.
        </p>
      </div>

      <div className="license-entry-actions">
        <button type="button" className="btn-direct-input" onClick={onDirectInput}>
          직접 입력하기
        </button>
        <button type="button" className="btn-camera" onClick={onCamera}>
          <span className="btn-camera-icon">📷</span>
          간편하게 촬영하기
        </button>
      </div>
    </div>
  )
}

export default LicenseEntry
