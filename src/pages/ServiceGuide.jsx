import { useParams, useNavigate } from 'react-router-dom'
import './ServiceGuide.css'

const SERVICE_DATA = {
  wheelchair: {
    title: '휠체어카 렌트',
    icon: '♿',
    description: '휠체어 사용자 및 보호자를 위한 전용 차량 렌트 서비스',
    target: '휠체어 사용자 및 이동이 불편한 분과 동행 보호자',
    notice: [
      '탑승 보조기기 유형(휠체어, 침대형 휠체어 등) 선택이 필수입니다.',
      '입력 정보는 차량 배차 및 상담 시 활용됩니다.',
      '운전자 정보 입력 시 면허 미등록 시 면허 등록 화면으로 이동합니다.',
    ],
  },
  accident: {
    title: '사고 대차 렌트',
    icon: '🚗',
    description: '사고 차량 수리 중 필요한 대체 차량을 제공하는 서비스',
    target: '교통사고로 차량 수리 중인 운전자',
    notice: [
      '사고 상황 및 보험 처리를 고려한 정보 입력이 필요합니다.',
      '입력된 정보는 상담 및 차량 매칭에 활용됩니다.',
    ],
  },
}

function ServiceGuide() {
  const { type } = useParams()
  const navigate = useNavigate()
  const data = SERVICE_DATA[type]

  if (!data) {
    navigate('/')
    return null
  }

  const handleReserve = () => {
    navigate(`/reservation/${type}`)
  }

  return (
    <div className="service-guide">
      <div className="service-header">
        <div className="service-icon">{data.icon}</div>
        <h1 className="service-title">{data.title}</h1>
      </div>

      <div className="service-content">
        <section className="service-section">
          <h3 className="section-label">서비스 안내</h3>
          <p className="section-text">{data.description}</p>
        </section>

        <section className="service-section">
          <h3 className="section-label">이용 대상</h3>
          <p className="section-text">{data.target}</p>
        </section>

        <section className="service-section">
          <h3 className="section-label">예약 진행 방식</h3>
          <div className="flow-steps">
            <span className="flow-step">정보 입력</span>
            <span className="flow-arrow">›</span>
            <span className="flow-step">상담 진행</span>
            <span className="flow-arrow">›</span>
            <span className="flow-step">예약 확정</span>
          </div>
        </section>

        <section className="service-section">
          <h3 className="section-label">유의 사항</h3>
          <ul className="notice-list">
            {data.notice.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <button className="cta-button" onClick={handleReserve}>
        예약하기
      </button>
    </div>
  )
}

export default ServiceGuide
