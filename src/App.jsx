import { useState } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import ServiceGuide from './pages/ServiceGuide'
import ReservationForm from './pages/ReservationForm'
import ReservationComplete from './pages/ReservationComplete'
import ReservationStatus from './pages/ReservationStatus'
import InUse from './pages/InUse'
import UseComplete from './pages/UseComplete'
import LicenseEntry from './pages/LicenseEntry'
import LicenseForm from './pages/LicenseForm'

const SCREENS = {
  HOME: 'home',
  SERVICE: 'service',
  RESERVATION: 'reservation',
  RESERVATION_COMPLETE: 'reservationComplete',
  RESERVATION_STATUS: 'reservationStatus',
  IN_USE: 'inUse',
  USE_COMPLETE: 'useComplete',
  LICENSE_ENTRY: 'licenseEntry',
  LICENSE_FORM: 'licenseForm',
}

function App() {
  const [screen, setScreen] = useState(SCREENS.HOME)
  const [serviceType, setServiceType] = useState(null)
  const [reservationData, setReservationData] = useState(null)
  const [returnToScreen, setReturnToScreen] = useState(null)
  const [preFillLicense, setPreFillLicense] = useState(null)
  const [reservationStep, setReservationStep] = useState(1)

  const showHeader = screen !== SCREENS.HOME

  const goHome = () => {
    setScreen(SCREENS.HOME)
    setServiceType(null)
    if (screen === SCREENS.USE_COMPLETE) setReservationData(null)
  }

  const goService = (type) => {
    setServiceType(type)
    setScreen(SCREENS.SERVICE)
  }

  const goReservation = () => {
    setReservationStep(1)
    setScreen(SCREENS.RESERVATION)
  }

  const goReservationComplete = (data) => {
    setReservationData(data)
    setScreen(SCREENS.RESERVATION_COMPLETE)
  }

  const goReservationStatus = () => {
    setScreen(SCREENS.RESERVATION_STATUS)
  }

  const goInUse = () => {
    setScreen(SCREENS.IN_USE)
  }

  const goUseComplete = () => {
    setScreen(SCREENS.USE_COMPLETE)
  }

  const goLicenseEntry = (returnTo = null) => {
    setReturnToScreen(returnTo)
    setScreen(SCREENS.LICENSE_ENTRY)
  }

  const goLicenseForm = () => {
    setScreen(SCREENS.LICENSE_FORM)
  }

  const goBackFromLicense = () => {
    if (screen === SCREENS.LICENSE_FORM) {
      setScreen(SCREENS.LICENSE_ENTRY)
      return
    }
    if (returnToScreen === 'reservation') {
      setReturnToScreen(null)
      setScreen(SCREENS.RESERVATION)
    } else {
      setReturnToScreen(null)
      setScreen(SCREENS.HOME)
    }
  }

  const onLicenseSaved = (license) => {
    setPreFillLicense(license)
    setReturnToScreen(null)
    setScreen(SCREENS.RESERVATION)
  }

  const clearPreFillLicense = () => {
    setPreFillLicense(null)
  }

  const onBack = () => {
    if (screen === SCREENS.LICENSE_ENTRY || screen === SCREENS.LICENSE_FORM) {
      goBackFromLicense()
      return
    }
    if (screen === SCREENS.RESERVATION) {
      if (reservationStep > 1) {
        setReservationStep((s) => s - 1)
      } else {
        goService(serviceType)
      }
      return
    }
    if (screen === SCREENS.SERVICE) goHome()
    else if (screen === SCREENS.RESERVATION_COMPLETE || screen === SCREENS.RESERVATION_STATUS) goHome()
    else if (screen === SCREENS.IN_USE || screen === SCREENS.USE_COMPLETE) goHome()
    else goHome()
  }

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.HOME:
        return <Home onSelectType={goService} />
      case SCREENS.SERVICE:
        return (
          <ServiceGuide
            type={serviceType}
            onReserve={goReservation}
            onBack={onBack}
          />
        )
      case SCREENS.RESERVATION:
        return (
          <ReservationForm
            type={serviceType}
            step={reservationStep}
            onStepChange={setReservationStep}
            onComplete={goReservationComplete}
            onBack={onBack}
            onOpenLicenseRegister={() => goLicenseEntry('reservation')}
            preFillLicense={preFillLicense}
            onClearPreFillLicense={clearPreFillLicense}
          />
        )
      case SCREENS.RESERVATION_COMPLETE:
        return (
          <ReservationComplete
            data={reservationData}
            onViewStatus={goReservationStatus}
          />
        )
      case SCREENS.RESERVATION_STATUS:
        return (
          <ReservationStatus
            data={reservationData}
            onPayment={goInUse}
            onBack={onBack}
          />
        )
      case SCREENS.IN_USE:
        return (
          <InUse
            data={reservationData}
            onExtend={() => alert('연장 요청이 접수되었습니다. 상담 후 연장이 확정됩니다.')}
            onReturn={goUseComplete}
          />
        )
      case SCREENS.USE_COMPLETE:
        return <UseComplete data={reservationData} onHome={goHome} />
      case SCREENS.LICENSE_ENTRY:
        return (
          <LicenseEntry
            onDirectInput={goLicenseForm}
            onCamera={() => alert('면허증 촬영 기능은 준비 중입니다. 직접 입력하기를 이용해 주세요.')}
          />
        )
      case SCREENS.LICENSE_FORM:
        return (
          <LicenseForm
            onSave={onLicenseSaved}
            onBack={goBackFromLicense}
          />
        )
      default:
        return <Home onSelectType={goService} />
    }
  }

  return (
    <div className="app">
      {showHeader && <Layout onBack={onBack} onHome={goHome} title={screen === SCREENS.LICENSE_ENTRY || screen === SCREENS.LICENSE_FORM ? '면허정보' : screen === SCREENS.SERVICE || screen === SCREENS.RESERVATION ? '예약' : screen === SCREENS.RESERVATION_STATUS ? '결제' : screen === SCREENS.IN_USE ? '이용 중' : screen === SCREENS.USE_COMPLETE ? '이용 완료' : '헤이드 렌트카'} />}
      <main className="main">
        {renderScreen()}
      </main>
    </div>
  )
}

export default App
