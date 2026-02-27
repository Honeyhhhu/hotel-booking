import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HotelList from './pages/HotelList';
import HotelDetail from './pages/HotelDetail';
import { BookingProvider } from './context/BookingContext';

function App() {
  return (
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<HotelList />} />
          <Route path="/hotel/:id" element={<HotelDetail />} />
        </Routes>
      </BookingProvider>
    </BrowserRouter>
  );
}

export default App;
