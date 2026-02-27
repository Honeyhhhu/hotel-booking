import { createContext, useContext, useState, type ReactNode } from 'react';
import dayjs from 'dayjs';

interface BookingState {
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  setCheckIn: (v: string) => void;
  setCheckOut: (v: string) => void;
  setRooms: (v: number) => void;
  setAdults: (v: number) => void;
  setChildren: (v: number) => void;
  setDates: (ci: string, co: string) => void;
  nights: number;
}

const BookingContext = createContext<BookingState | null>(null);

export const BookingProvider = ({ children: kids }: { children: ReactNode }) => {
  const today = dayjs();
  const [checkIn, setCheckIn] = useState(today.format('YYYY-MM-DD'));
  const [checkOut, setCheckOut] = useState(today.add(1, 'day').format('YYYY-MM-DD'));
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day');

  const setDates = (ci: string, co: string) => {
    setCheckIn(ci);
    setCheckOut(co);
  };

  return (
    <BookingContext.Provider value={{
      checkIn, checkOut, rooms, adults, children, nights,
      setCheckIn, setCheckOut, setRooms, setAdults, setChildren, setDates,
    }}>
      {kids}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};
