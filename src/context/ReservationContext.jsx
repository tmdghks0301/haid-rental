import { createContext, useContext, useState } from 'react'

const ReservationContext = createContext()

export function ReservationProvider({ children }) {
  const [reservation, setReservation] = useState(null)

  const updateReservation = (data) => {
    setReservation((prev) => ({ ...prev, ...data }))
  }

  const clearReservation = () => {
    setReservation(null)
  }

  return (
    <ReservationContext.Provider value={{ reservation, updateReservation, clearReservation }}>
      {children}
    </ReservationContext.Provider>
  )
}

export function useReservation() {
  const context = useContext(ReservationContext)
  if (!context) {
    throw new Error('useReservation must be used within ReservationProvider')
  }
  return context
}
