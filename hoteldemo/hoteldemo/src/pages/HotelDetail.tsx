import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  ChevronLeft, Star, MapPin, Car, Dumbbell, Wifi,
  Heart, Share2, ChevronRight, MessageCircle,
  Waves, UtensilsCrossed, Coffee, Shirt, BedDouble,
} from 'lucide-react';
import { Swiper, Tabs, CalendarPicker, Popup, Stepper } from 'antd-mobile';
import { hotels } from '../data/mockData';
import { useBooking } from '../context/BookingContext';

const facilityIcons: Record<string, React.ReactNode> = {
  '免费洗衣服务': <Shirt size={22} color="#666" />,
  '免费停车': <Car size={22} color="#666" />,
  '健身室': <Dumbbell size={22} color="#666" />,
  '家庭房': <BedDouble size={22} color="#666" />,
  '免费WiFi': <Wifi size={22} color="#666" />,
  '自助早餐': <UtensilsCrossed size={22} color="#666" />,
  '电梯': <Waves size={22} color="#666" />,
  '洗衣房': <Shirt size={22} color="#666" />,
  '自助洗衣': <Shirt size={22} color="#666" />,
  '书吧': <Coffee size={22} color="#666" />,
  '动入夜景': <Waves size={22} color="#666" />,
  '游泳池': <Waves size={22} color="#666" />,
};

const HotelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const booking = useBooking();
  const today = dayjs();

  const checkIn = booking.checkIn;
  const checkOut = booking.checkOut;
  const roomCount = booking.rooms;
  const adultCount = booking.adults;
  const nights = booking.nights;

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [guestPopupVisible, setGuestPopupVisible] = useState(false);
  const [selectedRoomFilters, setSelectedRoomFilters] = useState<string[]>([]);

  const handleCalendarConfirm = (val: [Date, Date] | null) => {
    if (!val) return;
    booking.setDates(dayjs(val[0]).format('YYYY-MM-DD'), dayjs(val[1]).format('YYYY-MM-DD'));
    setCalendarVisible(false);
  };

  const toggleRoomFilter = (tag: string) => {
    setSelectedRoomFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const hotel = hotels.find((h) => h.id === Number(id));
  const [currentImage, setCurrentImage] = useState(0);

  const tabItems = ['房型', '点评', '设施', '周边', '政策'];

  if (!hotel) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: '#999' }}>酒店不存在</p>
          <button onClick={() => navigate('/')} style={{ marginTop: '12px', color: '#2681FF', fontSize: '13px', background: 'none', border: 'none' }}>返回首页</button>
        </div>
      </div>
    );
  }

  const renderStars = (count: number) =>
    Array.from({ length: count }, (_, i) => (
      <Star key={i} size={12} fill="#FF8C00" color="#FF8C00" />
    ));

  const getDayLabel = (date: string) => {
    if (dayjs(date).isSame(today, 'day')) return '今天';
    if (dayjs(date).isSame(today.add(1, 'day'), 'day')) return '明天';
    return '';
  };

  const sortedRooms = [...hotel.rooms].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedRooms[0]?.price || hotel.price;

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', paddingBottom: '70px' }}>
      {/* Banner Carousel with overlay nav */}
      <div style={{ position: 'relative' }}>
        <Swiper
          onIndexChange={(i) => setCurrentImage(i)}
          style={{ '--height': '280px' } as React.CSSProperties}
          indicatorProps={{ style: { display: 'none' } }}
        >
          {hotel.images.map((img, idx) => (
            <Swiper.Item key={idx}>
              <img src={img} alt={`${hotel.name} ${idx + 1}`} style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} />
            </Swiper.Item>
          ))}
        </Swiper>
        {/* Overlay Nav */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', zIndex: 20 }}>
          <div
            onClick={() => navigate(-1)}
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
          >
            <ChevronLeft size={22} color="#fff" />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
              <Heart size={18} color="#fff" />
            </div>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
              <Share2 size={18} color="#fff" />
            </div>
          </div>
        </div>
        {/* Image counter */}
        <div style={{ position: 'absolute', bottom: '60px', right: '16px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '11px', padding: '3px 10px', borderRadius: '12px', zIndex: 10, backdropFilter: 'blur(4px)' }}>
          {currentImage + 1}/{hotel.images.length}
        </div>
      </div>

      {/* Hotel Info Card — overlaps banner */}
      <div style={{
        position: 'relative', zIndex: 10, marginTop: '-40px',
        background: '#fff', borderRadius: '16px 16px 0 0',
        padding: '20px 16px 16px',
      }}>
        {/* Name + Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A', margin: 0, flex: 1 }}>{hotel.name}</h2>
          <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>{renderStars(hotel.stars)}</div>
        </div>

        {/* Facilities Row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', marginTop: '20px', overflowX: 'auto' }} className="no-scrollbar">
          {hotel.facilities.slice(0, 5).map((f) => (
            <div key={f} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '64px', flexShrink: 0 }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {facilityIcons[f] || <Wifi size={22} color="#666" />}
              </div>
              <span style={{ fontSize: '11px', color: '#666', whiteSpace: 'nowrap' }}>{f}</span>
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '64px', flexShrink: 0 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronRight size={20} color="#999" />
            </div>
            <span style={{ fontSize: '11px', color: '#999', whiteSpace: 'nowrap' }}>设施政策</span>
          </div>
        </div>

        {/* Address / Map Row */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', background: '#F7F8FA', borderRadius: '10px', padding: '12px', alignItems: 'center' }}>
          <div style={{ width: '70px', height: '50px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#E8E8E8' }}>
            <img src={hotel.images[1] || hotel.images[0]} alt="map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 500, margin: 0 }}>{hotel.distance}</p>
            <p style={{ fontSize: '11px', color: '#999', margin: '4px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hotel.address}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <MapPin size={20} color="#2681FF" />
            <span style={{ fontSize: '10px', color: '#2681FF', marginTop: '2px' }}>地图</span>
          </div>
        </div>
      </div>

      {/* Date & Room Section */}
      <div style={{ background: '#fff', marginTop: '8px', padding: '16px' }}>
        {/* Date Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div onClick={() => setCalendarVisible(true)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '2px' }}>
              <span style={{ fontSize: '12px', color: '#999' }}>{getDayLabel(checkIn)}</span>
              <span style={{ fontSize: '12px', color: '#999' }}>{getDayLabel(checkOut)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#2681FF' }}>
                {dayjs(checkIn).format('M月DD日')}-{dayjs(checkOut).format('M月DD日')}
              </span>
              <span style={{ fontSize: '13px', color: '#999', marginLeft: '12px' }}>共{nights}晚</span>
            </div>
          </div>
          <div onClick={() => setGuestPopupVisible(true)} style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px', cursor: 'pointer' }}>
            <div style={{ fontSize: '11px', color: '#999', marginBottom: '2px' }}>间数人数</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A' }}>
              {roomCount}间 {adultCount}人
            </div>
          </div>
        </div>

        {/* Quick Room Filters */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', overflowX: 'auto' }} className="no-scrollbar">
          {['含早餐', '立即确认', '大床房', '双床房', '免费取消', '筛选'].map((tag) => (
            <button
              key={tag}
              onClick={() => toggleRoomFilter(tag)}
              style={{
                padding: '6px 14px', borderRadius: '16px', fontSize: '12px', whiteSpace: 'nowrap',
                border: selectedRoomFilters.includes(tag) ? '1px solid #2681FF' : '1px solid #E8E8E8',
                background: selectedRoomFilters.includes(tag) ? '#EBF3FF' : '#fff',
                color: selectedRoomFilters.includes(tag) ? '#2681FF' : '#666',
                fontWeight: selectedRoomFilters.includes(tag) ? 500 : 400,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Sticky Tab Nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: '#fff', borderBottom: '1px solid #F0F0F0' }}>
        <Tabs
          defaultActiveKey="房型"
          style={{
            '--title-font-size': '14px',
            '--active-title-color': '#2681FF',
            '--active-line-color': '#2681FF',
            '--active-line-height': '2px',
          } as React.CSSProperties}
        >
          {tabItems.map((tab) => (
            <Tabs.Tab title={tab} key={tab} />
          ))}
        </Tabs>
      </div>

      {/* Room List */}
      <div style={{ padding: '0 0 8px' }}>
        {sortedRooms.map((room, idx) => (
          <div key={room.id} style={{
            background: '#fff', margin: '8px 12px 0', borderRadius: '12px', overflow: 'hidden',
            border: idx === 0 ? '1px solid #FFD591' : 'none',
          }}>
            {idx === 0 && (
              <div style={{ background: '#FFF7E6', padding: '6px 12px', fontSize: '12px', color: '#FF8C00', fontWeight: 600 }}>
                本酒店好评No.1
              </div>
            )}
            <div style={{ display: 'flex', padding: '12px', gap: '12px' }}>
              {/* Room Image */}
              <div style={{ width: '110px', height: '90px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                <img src={room.image} alt={room.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '8px' }}>
                  {hotel.images.length}
                </div>
              </div>

              {/* Room Info */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{room.name}</h4>
                </div>
                <p style={{ fontSize: '12px', color: '#999', margin: '0 0 4px', lineHeight: 1.6 }}>
                  {room.bedType} {room.area}m² {room.maxGuests}人入住 {room.floor}
                </p>
                {room.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    {room.tags.map((tag) => (
                      <span key={tag} style={{ fontSize: '10px', color: '#666', border: '1px solid #E8E8E8', padding: '1px 6px', borderRadius: '2px' }}>{tag}</span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '4px', marginTop: 'auto' }}>
                  <span style={{ fontSize: '12px', color: '#CCC', textDecoration: 'line-through' }}>¥{room.originalPrice}</span>
                  <span style={{ fontSize: '11px', color: '#FF6600' }}>¥</span>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: '#FF6600', lineHeight: 1 }}>{room.price}</span>
                  <span style={{ fontSize: '11px', color: '#FF6600' }}>起</span>
                </div>
                <div style={{ textAlign: 'right', marginTop: '2px' }}>
                  <span style={{ fontSize: '11px', color: '#2681FF' }}>优惠{room.originalPrice - room.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CalendarPicker */}
      <CalendarPicker
        visible={calendarVisible}
        selectionMode="range"
        onClose={() => setCalendarVisible(false)}
        onConfirm={handleCalendarConfirm}
        min={today.toDate()}
        max={today.add(90, 'day').toDate()}
        defaultValue={[new Date(checkIn), new Date(checkOut)]}
        title="选择入住-离店日期"
        confirmText="确定"
      />

      {/* Guest Popup */}
      <Popup
        visible={guestPopupVisible}
        onMaskClick={() => setGuestPopupVisible(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      >
        <div style={{ padding: '0 0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', position: 'relative' }}>
            <button onClick={() => setGuestPopupVisible(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: '#333', padding: '4px', lineHeight: 1 }}>✕</button>
            <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '17px', fontWeight: 700, color: '#1A1A1A' }}>选择客房和入住人数</span>
          </div>
          <div style={{ height: '1px', background: '#F0F0F0', margin: '0 20px' }} />
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0F0F0' }}>
            <span style={{ fontSize: '17px', fontWeight: 500, color: '#1A1A1A' }}>间数</span>
            <Stepper min={1} max={10} value={roomCount} onChange={(v) => booking.setRooms(v)} style={{ '--height': '36px', '--input-width': '40px', '--input-font-size': '18px', '--border-radius': '50%', '--button-width': '36px', '--input-font-color': '#1A1A1A' } as React.CSSProperties} />
          </div>
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '17px', fontWeight: 500, color: '#1A1A1A' }}>成人数</span>
            <Stepper min={1} max={20} value={adultCount} onChange={(v) => booking.setAdults(v)} style={{ '--height': '36px', '--input-width': '40px', '--input-font-size': '18px', '--border-radius': '50%', '--button-width': '36px', '--input-font-color': '#1A1A1A' } as React.CSSProperties} />
          </div>
          <div style={{ padding: '12px 20px 0' }}>
            <button
              onClick={() => setGuestPopupVisible(false)}
              style={{ width: '100%', background: 'linear-gradient(135deg, #4A9AFF 0%, #2681FF 100%)', color: '#fff', fontSize: '17px', fontWeight: 700, padding: '14px 0', borderRadius: '12px', border: 'none' }}
            >
              完成
            </button>
          </div>
        </div>
      </Popup>

      {/* Bottom Fixed Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30,
        background: '#fff', borderTop: '1px solid #F0F0F0',
        display: 'flex', alignItems: 'center', padding: '8px 16px',
        maxWidth: '480px', margin: '0 auto',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '16px' }}>
          <MessageCircle size={22} color="#333" />
          <span style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>问酒店</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', flex: 1 }}>
          <span style={{ fontSize: '12px', color: '#FF6600' }}>¥</span>
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#FF6600', lineHeight: 1 }}>{lowestPrice}</span>
          <span style={{ fontSize: '12px', color: '#FF6600' }}>起</span>
        </div>
        <button style={{
          padding: '12px 32px', borderRadius: '24px', border: 'none',
          background: 'linear-gradient(135deg, #4A9AFF 0%, #2681FF 100%)',
          color: '#fff', fontSize: '16px', fontWeight: 700,
          boxShadow: '0 4px 12px rgba(38,129,255,0.3)',
        }}>
          查看房型
        </button>
      </div>
    </div>
  );
};

export default HotelDetail;
