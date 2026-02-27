import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { MapPin, ChevronDown, Locate } from 'lucide-react';
import { CalendarPicker, Popup, Stepper, Slider, Toast, Swiper } from 'antd-mobile';
import { quickTags } from '../data/mockData';
import { useBooking } from '../context/BookingContext';

const Home = () => {
  const navigate = useNavigate();
  const booking = useBooking();
  const today = dayjs();
  const tomorrow = today.add(1, 'day');

  const [city] = useState('郑州');
  const [keyword, setKeyword] = useState('');
  const [selectedStar, setSelectedStar] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2200]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const rooms = booking.rooms;
  const adults = booking.adults;
  const children = booking.children;

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [guestPopupVisible, setGuestPopupVisible] = useState(false);
  const [priceStarVisible, setPriceStarVisible] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    if (locating) return;
    setLocating(true);
    Toast.show({ icon: 'loading', content: '定位中...', duration: 0 });
    setTimeout(() => {
      setLocating(false);
      Toast.clear();
      Toast.show({ icon: 'success', content: '定位成功：郑州, 金水区附近', duration: 1500 });
    }, 1500);
  };

  const priceRanges = ['¥250以下', '¥250-¥400', '¥400-¥500', '¥500-¥650', '¥650-¥1100', '¥1100-¥1700', '¥1700-¥2200', '¥2200以上'];
  const starLevels = [
    { label: '2钻/星及以下', sub: '经济' },
    { label: '3钻/星', sub: '舒适' },
    { label: '4钻/星', sub: '高档' },
    { label: '5钻/星', sub: '豪华' },
    { label: '金钻酒店', sub: '奢华体验' },
    { label: '铂钻酒店', sub: '超奢品质' },
  ];
  const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day');

  const getDayLabel = (date: Date) => {
    const d = dayjs(date);
    if (d.isSame(today, 'day')) return '今天';
    if (d.isSame(tomorrow, 'day')) return '明天';
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[d.day()];
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams({
      city, keyword,
      star: selectedStar || '不限', price: selectedPrice,
      tags: selectedTags.join(','),
    });
    navigate(`/list?${params.toString()}`);
  };

  const handleCalendarConfirm = (val: [Date, Date] | null) => {
    if (!val) return;
    booking.setDates(dayjs(val[0]).format('YYYY-MM-DD'), dayjs(val[1]).format('YYYY-MM-DD'));
    setCalendarVisible(false);
  };

  const clearPriceStar = () => {
    setSelectedPrice('');
    setSelectedStar('');
    setPriceRange([0, 2200]);
  };

  const getPriceStarLabel = () => {
    const parts = [selectedPrice, selectedStar].filter(Boolean);
    if (parts.length > 0) return parts.join(',');
    return '价格/星级';
  };
  const hasPriceStarSelection = selectedPrice || selectedStar;

  return (
    <div className="min-h-screen bg-bg-page">
      {/* Ad Banner Swiper */}
      <div style={{ position: 'relative', width: '100%', height: '240px' }}>
        <Swiper
          autoplay
          loop
          autoplayInterval={4000}
          indicatorProps={{
            style: { '--dot-color': 'rgba(255,255,255,0.4)', '--active-dot-color': '#fff', '--dot-size': '6px', '--active-dot-size': '14px', '--dot-spacing': '6px' } as React.CSSProperties,
          }}
          style={{ height: '100%', '--border-radius': '0px' } as React.CSSProperties}
        >
          {[
            { id: 4, img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop', tag: '酒店套餐', discount: '7折起', title: '郑州金水希尔顿欢朋酒店' },
            { id: 1, img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop', tag: '限时特惠', discount: '5折起', title: '维也纳酒店(郑州高新万达店)' },
            { id: 6, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=500&fit=crop', tag: '品质推荐', discount: '8折起', title: '亚朵酒店(郑州高铁东站店)' },
          ].map((item) => (
            <Swiper.Item key={item.id}>
              <div
                style={{ position: 'relative', width: '100%', height: '240px', cursor: 'pointer' }}
                onClick={() => navigate(`/hotel/${item.id}`)}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, transparent 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                }}>
                  <div style={{ padding: '16px 16px 60px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ background: '#FF6600', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '2px', fontWeight: 700 }}>{item.tag}</span>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '2px' }}>{item.discount}</span>
                    </div>
                    <p style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: 0 }}>{item.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '4px' }}>点击查看详情 &gt;</p>
                  </div>
                </div>
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
      </div>

      {/* Search Card */}
      <div
        className="relative z-10"
        style={{
          margin: '0 12px',
          marginTop: '-40px',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        {/* 国内 Tab */}
        <div style={{ padding: '20px 20px 8px' }}>
          <span style={{ color: '#2681FF', fontSize: '17px', fontWeight: 700 }}>国内</span>
        </div>

        {/* Location Row — 灰色圆角框 */}
        <div style={{ margin: '8px 20px 0', background: '#F5F5F5', borderRadius: '8px', padding: '10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="#2681FF" />
            <span style={{ fontSize: '12px', color: '#666' }}>已定位到</span>
            <span style={{ fontSize: '12px', color: '#1A1A1A', fontWeight: 500 }}>{city}, 金水区附近</span>
          </div>
        </div>

        {/* City + Search */}
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#1A1A1A' }}>我的位置</span>
            <ChevronDown size={16} color="#666" />
          </div>
          <Locate
            size={18}
            color="#2681FF"
            style={{
              flexShrink: 0,
              cursor: 'pointer',
              animation: locating ? 'spin 1s linear infinite' : 'none',
            }}
            onClick={handleLocate}
          />
          <div style={{ width: '1px', height: '20px', background: '#E8E8E8', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="位置/品牌/酒店"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', color: '#666', background: 'transparent' }}
            />
          </div>
        </div>

        {/* 分隔线 */}
        <div style={{ height: '1px', background: '#F0F0F0', margin: '0 20px' }} />

        {/* Date Selection */}
        <div
          style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setCalendarVisible(true)}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A' }}>
                {dayjs(checkIn).format('MM月DD日')}
              </span>
              <span style={{ fontSize: '12px', color: '#999' }}>{getDayLabel(checkIn)}</span>
            </div>

            <span style={{ color: '#CCC', fontSize: '14px', margin: '0 8px', flexShrink: 0 }}>—</span>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A' }}>
                {dayjs(checkOut).format('MM月DD日')}
              </span>
              <span style={{ fontSize: '12px', color: '#999' }}>{getDayLabel(checkOut)}</span>
            </div>
          </div>

          <span style={{
            color: '#2681FF',
            fontSize: '13px',
            fontWeight: 700,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            marginLeft: '12px',
            padding: '4px 10px',
            background: '#EBF3FF',
            borderRadius: '4px',
          }}>
            共{nights}晚
          </span>
        </div>

        {/* 分隔线 */}
        <div style={{ height: '1px', background: '#F0F0F0', margin: '0 20px' }} />

        {/* Room & Guest + Star Filter */}
        <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
            onClick={() => setGuestPopupVisible(true)}
          >
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>{rooms}</span>
            <span style={{ fontSize: '14px', color: '#666' }}>间房</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginLeft: '10px' }}>{adults}</span>
            <span style={{ fontSize: '14px', color: '#666' }}>成人</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginLeft: '10px' }}>{children}</span>
            <span style={{ fontSize: '14px', color: '#666' }}>儿童</span>
            <ChevronDown size={16} color="#999" style={{ marginLeft: '4px' }} />
          </div>
          <button
            onClick={() => setPriceStarVisible(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              color: hasPriceStarSelection ? '#2681FF' : '#CCC',
              background: 'none',
              border: 'none',
              maxWidth: '160px',
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: hasPriceStarSelection ? 500 : 400 }}>
              {getPriceStarLabel()}
            </span>
            <ChevronDown size={16} color={hasPriceStarSelection ? '#2681FF' : '#CCC'} style={{ flexShrink: 0 }} />
          </button>
        </div>

        {/* 分隔线 */}
        <div style={{ height: '1px', background: '#F0F0F0', margin: '0 20px' }} />

        {/* Quick Tags — 描边标签横向滚动 */}
        <div
          style={{ padding: '14px 20px', display: 'flex', gap: '10px', overflowX: 'auto' }}
          className="no-scrollbar"
        >
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              style={{
                padding: '7px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                whiteSpace: 'nowrap',
                border: selectedTags.includes(tag) ? '1px solid #2681FF' : '1px solid #E0E0E0',
                background: selectedTags.includes(tag) ? '#EBF3FF' : '#fff',
                color: selectedTags.includes(tag) ? '#2681FF' : '#333',
                fontWeight: selectedTags.includes(tag) ? 500 : 400,
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Button */}
        <div style={{ padding: '8px 20px 20px' }}>
          <button
            onClick={handleSearch}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #4A9AFF 0%, #2681FF 100%)',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 700,
              padding: '14px 0',
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 16px rgba(38,129,255,0.35)',
              letterSpacing: '8px',
              textIndent: '8px',
            }}
          >
            查 询
          </button>
        </div>
      </div>


      <div
        style={{
          margin: '12px 12px 0',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          padding: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A' }}>今日特惠</span>
      
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }} className="no-scrollbar">
          {[
            { id: 4, name: '郑州希尔顿酒店', price: 388, original: 688, img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=200&h=150&fit=crop' },
            { id: 5, name: '郑州万达文华', price: 458, original: 828, img: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=200&h=150&fit=crop' },
            { id: 6, name: '郑州洲际酒店', price: 528, original: 968, img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200&h=150&fit=crop' },
          ].map((h) => (
            <div key={h.name} onClick={() => navigate(`/hotel/${h.id}`)} style={{ flexShrink: 0, width: '140px', borderRadius: '12px', overflow: 'hidden', background: '#F7F7F7', cursor: 'pointer' }}>
              <img src={h.img} alt={h.name} style={{ width: '100%', height: '90px', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '8px' }}>
                <p style={{ fontSize: '12px', fontWeight: 500, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                  <span style={{ color: '#FF6600', fontSize: '15px', fontWeight: 700 }}>¥{h.price}</span>
                  <span style={{ color: '#CCC', fontSize: '11px', textDecoration: 'line-through' }}>¥{h.original}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: '32px' }} />

      {/* antd-mobile CalendarPicker */}
      <CalendarPicker
        visible={calendarVisible}
        selectionMode="range"
        onClose={() => setCalendarVisible(false)}
        onConfirm={handleCalendarConfirm}
        min={today.toDate()}
        max={today.add(90, 'day').toDate()}
        defaultValue={[checkIn, checkOut]}
        title="选择入住-离店日期"
        confirmText="确定"
      />

      {/* antd-mobile Popup — 选择客房和入住人数 */}
      <Popup
        visible={guestPopupVisible}
        onMaskClick={() => setGuestPopupVisible(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
      >
        <div style={{ padding: '0 0 20px' }}>
          {/* Header: X + 标题 */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', position: 'relative' }}>
            <button
              onClick={() => setGuestPopupVisible(false)}
              style={{ background: 'none', border: 'none', fontSize: '20px', color: '#333', padding: '4px', lineHeight: 1 }}
            >
              ✕
            </button>
            <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '17px', fontWeight: 700, color: '#1A1A1A' }}>
              选择客房和入住人数
            </span>
          </div>

          {/* 提示条 */}
          <div style={{ margin: '0 20px', padding: '10px 12px', background: '#F5F7FA', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#2681FF', fontSize: '14px' }}>ⓘ</span>
            <span style={{ fontSize: '13px', color: '#666' }}>入住人数较多时，试试增加间数</span>
          </div>

          {/* 分隔线 */}
          <div style={{ height: '1px', background: '#F0F0F0', margin: '16px 20px 0' }} />

          {/* 间数 */}
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0F0F0' }}>
            <span style={{ fontSize: '17px', fontWeight: 500, color: '#1A1A1A' }}>间数</span>
            <Stepper
              min={1} max={10} value={rooms} onChange={(v) => booking.setRooms(v)}
              style={{ '--height': '36px', '--input-width': '40px', '--input-font-size': '18px', '--border-radius': '50%', '--button-width': '36px', '--input-font-color': '#1A1A1A' } as React.CSSProperties}
            />
          </div>

          {/* 成人数 */}
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F0F0F0' }}>
            <span style={{ fontSize: '17px', fontWeight: 500, color: '#1A1A1A' }}>成人数</span>
            <Stepper
              min={1} max={20} value={adults} onChange={(v) => booking.setAdults(v)}
              style={{ '--height': '36px', '--input-width': '40px', '--input-font-size': '18px', '--border-radius': '50%', '--button-width': '36px', '--input-font-color': '#1A1A1A' } as React.CSSProperties}
            />
          </div>

          {/* 儿童数 */}
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 500, color: '#1A1A1A' }}>儿童数</div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>0-17岁</div>
            </div>
            <Stepper
              min={0} max={10} value={children} onChange={(v) => booking.setChildren(v)}
              style={{ '--height': '36px', '--input-width': '40px', '--input-font-size': '18px', '--border-radius': '50%', '--button-width': '36px', '--input-font-color': '#1A1A1A' } as React.CSSProperties}
            />
          </div>

          {/* 完成按钮 */}
          <div style={{ padding: '12px 20px 0' }}>
            <button
              onClick={() => setGuestPopupVisible(false)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #4A9AFF 0%, #2681FF 100%)',
                color: '#fff',
                fontSize: '17px',
                fontWeight: 700,
                padding: '14px 0',
                borderRadius: '12px',
                border: 'none',
                letterSpacing: '4px',
              }}
            >
              完成
            </button>
          </div>
        </div>
      </Popup>

      {/* 价格/星级 Popup */}
      <Popup
        visible={priceStarVisible}
        onMaskClick={() => setPriceStarVisible(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <div style={{ padding: '0 0 20px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', position: 'relative' }}>
            <button
              onClick={() => setPriceStarVisible(false)}
              style={{ background: 'none', border: 'none', fontSize: '20px', color: '#333', padding: '4px', lineHeight: 1 }}
            >
              ✕
            </button>
            <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '17px', fontWeight: 700, color: '#1A1A1A' }}>
              选择价格/星级
            </span>
          </div>

          {/* 价格区间 */}
          <div style={{ padding: '0 20px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>价格</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999', marginBottom: '4px' }}>
              <span>¥0</span>
              <span>¥2200以上</span>
            </div>
            <Slider
              range
              min={0}
              max={2200}
              step={50}
              value={priceRange}
              onChange={(v) => setPriceRange(v as [number, number])}
              style={{ '--fill-color': '#2681FF' } as React.CSSProperties}
            />
          </div>

          {/* 价格快捷选择 */}
          <div style={{ padding: '16px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {priceRanges.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPrice(selectedPrice === p ? '' : p)}
                style={{
                  padding: '10px 0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  border: selectedPrice === p ? '1px solid #2681FF' : '1px solid #E8E8E8',
                  background: selectedPrice === p ? '#EBF3FF' : '#fff',
                  color: selectedPrice === p ? '#2681FF' : '#333',
                  fontWeight: selectedPrice === p ? 500 : 400,
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* 分隔线 */}
          <div style={{ height: '1px', background: '#F0F0F0', margin: '20px 20px 0' }} />

          {/* 星级/钻级 */}
          <div style={{ padding: '16px 20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A' }}>星级/钻级</span>
              <span style={{ fontSize: '12px', color: '#2681FF' }}>国内星级/钻级说明 &gt;</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {starLevels.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedStar(selectedStar === s.label ? '' : s.label)}
                  style={{
                    padding: '12px 4px 10px',
                    borderRadius: '8px',
                    border: selectedStar === s.label ? '1px solid #2681FF' : '1px solid #E8E8E8',
                    background: selectedStar === s.label ? '#EBF3FF' : '#fff',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '13px', color: selectedStar === s.label ? '#2681FF' : '#333', fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: '11px', color: selectedStar === s.label ? '#2681FF' : '#999', marginTop: '2px' }}>{s.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 说明文字 */}
          <div style={{ padding: '12px 20px 0', fontSize: '11px', color: '#999', lineHeight: 1.5 }}>
            酒店未参加星级评定但设施服务达到相应水平，采用钻级分类，仅供参考
          </div>

          {/* 底部按钮 */}
          <div style={{ padding: '16px 20px 0', display: 'flex', gap: '12px' }}>
            <button
              onClick={clearPriceStar}
              style={{
                flex: 1,
                padding: '13px 0',
                borderRadius: '12px',
                border: '1px solid #E0E0E0',
                background: '#fff',
                fontSize: '15px',
                fontWeight: 500,
                color: '#333',
              }}
            >
              清空
            </button>
            <button
              onClick={() => setPriceStarVisible(false)}
              style={{
                flex: 1,
                padding: '13px 0',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #4A9AFF 0%, #2681FF 100%)',
                fontSize: '15px',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              完成
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Home;
