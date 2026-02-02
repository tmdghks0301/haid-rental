import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ServiceGuide from './pages/ServiceGuide'
import ReservationForm from './pages/ReservationForm'
import ReservationComplete from './pages/ReservationComplete'
import ReservationStatus from './pages/ReservationStatus'
import InUse from './pages/InUse'
import UseComplete from './pages/UseComplete'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="service/:type" element={<ServiceGuide />} />
        <Route path="reservation/:type" element={<ReservationForm />} />
        <Route path="reservation-complete" element={<ReservationComplete />} />
        <Route path="reservation-status" element={<ReservationStatus />} />
        <Route path="in-use" element={<InUse />} />
        <Route path="use-complete" element={<UseComplete />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
