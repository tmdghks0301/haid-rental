import { useState } from 'react'
import './ReturnChecklist.css'

function ReturnChecklist({ data, onConfirm, onBack }) {
  const [locationYes, setLocationYes] = useState(true)
  const [floorYes, setFloorYes] = useState(true)
  const [windowsOk, setWindowsOk] = useState(true)
  const [lightsOk, setLightsOk] = useState(true)
  const [belongingsOk, setBelongingsOk] = useState(true)

  if (!data) return <div className="loading">로딩 중...</div>

  const returnLocation = data.returnLocation || '라임프렌즈 주차장'
  const isAccident = data.type === '사고 대차 렌트'
  const allChecked = locationYes && floorYes && windowsOk && lightsOk && belongingsOk

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <div className="return-checklist">
      <section className="checklist-section">
        <p className="checklist-question">{returnLocation}에 반납하셨나요?</p>
        <div className="checklist-options">
          <label className="checklist-option">
            <input type="radio" name="location" checked={locationYes} onChange={() => setLocationYes(true)} />
            <span className="option-check">✓</span>
            <span>네</span>
          </label>
          <label className="checklist-option">
            <input type="radio" name="location" checked={!locationYes} onChange={() => setLocationYes(false)} />
            <span className="option-check">✓</span>
            <span>아니요</span>
          </label>
        </div>
      </section>

      {!isAccident && (
        <section className="checklist-section">
          <p className="checklist-question">해당 층에 반납하셨나요?</p>
          <div className="checklist-options">
            <label className="checklist-option">
              <input type="radio" name="floor" checked={floorYes} onChange={() => setFloorYes(true)} />
              <span className="option-check">✓</span>
              <span>네</span>
            </label>
            <label className="checklist-option">
              <input type="radio" name="floor" checked={!floorYes} onChange={() => setFloorYes(false)} />
              <span className="option-check">✓</span>
              <span>아니요</span>
            </label>
          </div>
        </section>
      )}

      <section className="checklist-section last-check">
        <h2 className="last-check-title">반납 전 마지막 확인</h2>
        <div className="last-check-list">
          <div className="last-check-item">
            <span className="item-question">창문은 모두 닫았나요?</span>
            <div className="item-options">
              <label><input type="radio" name="windows" checked={windowsOk} onChange={() => setWindowsOk(true)} /> <span className="option-check">✓</span> 네</label>
              <label><input type="radio" name="windows" checked={!windowsOk} onChange={() => setWindowsOk(false)} /> <span className="option-check">✓</span> 아니요</label>
            </div>
          </div>
          <div className="last-check-item">
            <span className="item-question">실내등은 모두 꼈나요?</span>
            <div className="item-options">
              <label><input type="radio" name="lights" checked={lightsOk} onChange={() => setLightsOk(true)} /> <span className="option-check">✓</span> 네</label>
              <label><input type="radio" name="lights" checked={!lightsOk} onChange={() => setLightsOk(false)} /> <span className="option-check">✓</span> 아니요</label>
            </div>
          </div>
          <div className="last-check-item">
            <span className="item-question">개인 소지품은 모두 챙겼나요?</span>
            <div className="item-options">
              <label><input type="radio" name="belongings" checked={belongingsOk} onChange={() => setBelongingsOk(true)} /> <span className="option-check">✓</span> 네</label>
              <label><input type="radio" name="belongings" checked={!belongingsOk} onChange={() => setBelongingsOk(false)} /> <span className="option-check">✓</span> 아니요</label>
            </div>
          </div>
        </div>
      </section>

      <button type="button" className="checklist-info-link" onClick={() => alert('이용규칙 및 패널티 안내 페이지는 준비 중입니다.')}>
        <span>헤이드 렌트카 이용규칙 및 패널티 안내</span>
        <span className="link-arrow">&gt;</span>
      </button>

      <button
        type="button"
        className={`cta-button return-confirm-btn ${allChecked ? '' : 'disabled'}`}
        onClick={handleConfirm}
        disabled={!allChecked}
      >
        반납하기
      </button>
    </div>
  )
}

export default ReturnChecklist
