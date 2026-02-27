import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { ChevronLeft, Search, ChevronDown, Star } from 'lucide-react';
import { Popup, Slider, CalendarPicker, Stepper } from 'antd-mobile';
import { hotels, quickTags } from '../data/mockData';
import { useBooking } from '../context/BookingContext';

const HotelList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const booking = useBooking();

  const city = searchParams.get('city') || '郑州';
  const keyword = searchParams.get('keyword') || '';
  const initialStar = searchParams.get('star') || '不限';
  const initialTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const today = dayjs();

  const checkIn = booking.checkIn;
  const checkOut = booking.checkOut;
  const roomCount = booking.rooms;
  const adultCount = booking.adults;
  const nights = booking.nights;

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [guestPopupVisible, setGuestPopupVisible] = useState(false);

  const handleCalendarConfirm = (val: [Date, Date] | null) => {
    if (!val) return;
    booking.setDates(dayjs(val[0]).format('YYYY-MM-DD'), dayjs(val[1]).format('YYYY-MM-DD'));
    setCalendarVisible(false);
  };

  const [searchKeyword, setSearchKeyword] = useState(keyword);
  const [selectedStar, setSelectedStar] = useState(initialStar);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [starPopupVisible, setStarPopupVisible] = useState(false);
  const [filterPopupVisible, setFilterPopupVisible] = useState(false);
  const [locationPopupVisible, setLocationPopupVisible] = useState(false);
  const [locationCategory, setLocationCategory] = useState('热门');
  const [selectedLocation, setSelectedLocation] = useState('');

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2200]);
  const [selectedPriceLabel, setSelectedPriceLabel] = useState('');
  const [selectedStarLabel, setSelectedStarLabel] = useState('');
  const [filterCategory, setFilterCategory] = useState('热门筛选');

  const priceRanges = [
    '¥250以下', '¥250-¥400', '¥400-¥500',
    '¥500-¥650', '¥650-¥1100', '¥1100-¥1700',
    '¥1700-¥2200', '¥2200以上',
  ];
  const starLevels = [
    { label: '2钻/星及以下', sub: '经济' },
    { label: '3钻/星', sub: '舒适' },
    { label: '4钻/星', sub: '高档' },
    { label: '5钻/星', sub: '豪华' },
    { label: '金钻酒店', sub: '奢华体验' },
    { label: '铂钻酒店', sub: '超奢品质' },
  ];
  const filterCategories = ['热门筛选', '住宿类型', '主题特色', '品牌', '设施', '床型餐食', '点评', '权益/促销', '政策服务'];
  const filterData: Record<string, string[]> = {
    '热门筛选': ['上榜酒店', '双床房', '大床房', '家庭房', '免费停车', '4.5分以上', '含早餐', '低碳酒店'],
    '住宿类型': ['酒店', '民宿', '酒店公寓', '青年旅馆', '公寓', '钟点房', '别墅', '度假村', '特色住宿'],
    '主题特色': ['亲子酒店', '电竞酒店', '近地铁', '温泉酒店', '影视酒店', '宠物友好'],
    '品牌': ['全季', '亚朵', '汉庭', '希尔顿', '万豪', '首旅如家', '维也纳', '洞山开元'],
    '设施': ['免费WiFi', '游泳池', '健身房', '停车场', '充电桩', '洗衣服务', '行李寄存', 'SPA'],
    '床型餐食': ['大床房', '双床房', '家庭房', '含早餐', '免费兑早餐', '行政酒廊'],
    '点评': ['4.5分以上', '4.0分以上', '3.5分以上'],
    '权益/促销': ['限时特惠', '新人专享', '连住优惠', '早鸟价'],
    '政策服务': ['免费取消', '到店付款', '闪住', '可开发票'],
  };

  const locationCategories = ['直线距离', '热门', '景点', '行政区', '商业区', '地铁线', '机场车站', '医院', '大学'];
  const locationData: Record<string, { name: string; pct: string }[]> = {
    '直线距离': [
      { name: '距我最近', pct: '' },
      { name: '1km以内', pct: '' },
      { name: '3km以内', pct: '' },
      { name: '5km以内', pct: '' },
    ],
    '热门': [
      { name: '二七广场', pct: '12.3%' },
      { name: '郑州东站', pct: '8.5%' },
      { name: '花园路商圈', pct: '6.2%' },
      { name: '紫荆山', pct: '5.1%' },
      { name: '高新区', pct: '4.8%' },
      { name: '郑州站', pct: '4.2%' },
      { name: '会展中心', pct: '3.6%' },
      { name: '大学路', pct: '2.8%' },
    ],
    '景点': [
      { name: '少林寺', pct: '9.1%' },
      { name: '河南博物院', pct: '5.4%' },
      { name: '二七纪念塔', pct: '4.7%' },
      { name: '黄河风景名胜区', pct: '3.2%' },
    ],
    '行政区': [
      { name: '金水区', pct: '15.2%' },
      { name: '二七区', pct: '10.3%' },
      { name: '中原区', pct: '8.1%' },
      { name: '管城区', pct: '5.6%' },
      { name: '高新区', pct: '4.8%' },
      { name: '郑东新区', pct: '7.2%' },
    ],
    '商业区': [
      { name: '花园路商圈', pct: '8.5%' },
      { name: '二七商圈', pct: '7.3%' },
      { name: '正弘城', pct: '5.1%' },
      { name: '万达广场', pct: '4.2%' },
    ],
    '地铁线': [
      { name: '地铁1号线', pct: '11.2%' },
      { name: '地铁2号线', pct: '8.7%' },
      { name: '地铁3号线', pct: '5.3%' },
      { name: '地铁5号线', pct: '6.1%' },
    ],
    '机场车站': [
      { name: '郑州站', pct: '6.5%' },
      { name: '郑州东站', pct: '8.5%' },
      { name: '新郑国际机场', pct: '3.2%' },
    ],
    '医院': [
      { name: '河南省人民医院', pct: '4.1%' },
      { name: '郑大一附院', pct: '3.8%' },
      { name: '郑州市中心医院', pct: '2.5%' },
    ],
    '大学': [
      { name: '郑州大学', pct: '5.2%' },
      { name: '河南大学(龙子湖)', pct: '3.1%' },
      { name: '河南农业大学', pct: '2.4%' },
    ],
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredHotels = useMemo(() => {
    let result = [...hotels];
    if (searchKeyword) {
      result = result.filter(
        (h) =>
          h.name.includes(searchKeyword) ||
          h.address.includes(searchKeyword) ||
          h.tags.some((t) => t.includes(searchKeyword))
      );
    }
    if (selectedStar !== '不限') {
      const starMap: Record<string, number[]> = {
        '经济型': [1, 2], '三星/舒适': [3], '四星/高档': [4], '五星/豪华': [5],
      };
      const validStars = starMap[selectedStar] || [];
      if (validStars.length > 0) {
        result = result.filter((h) => validStars.includes(h.stars));
      }
    }
    if (selectedTags.length > 0) {
      result = result.filter((h) =>
        selectedTags.some(
          (tag) => h.tags.includes(tag) || h.name.includes(tag) || (tag === '4.5分以上' && h.rating >= 4.5)
        )
      );
    }
    return result;
  }, [searchKeyword, selectedStar, selectedTags]);

  const renderStars = (count: number) =>
    Array.from({ length: count }, (_, i) => (
      <Star key={i} size={10} className="fill-star text-star" />
    ));

  const getStarLabel = (stars: number) => {
    if (stars >= 5) return '金钻';
    if (stars >= 4) return '高档';
    if (stars >= 3) return '舒适';
    return '经济';
  };

  const formatCount = (n: number) => {
    if (n >= 10000) return (n / 10000).toFixed(1) + '万';
    return String(n);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 30, background: '#fff' }}>
        {/* Top Bar */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', height: '48px', gap: '8px' }}>
          <ChevronLeft
            size={22}
            color="#333"
            style={{ flexShrink: 0, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A' }}>{city}</span>
            <div onClick={() => setCalendarVisible(true)} style={{ fontSize: '11px', color: '#2681FF', lineHeight: 1.3, cursor: 'pointer' }}>
              <div>{dayjs(checkIn).format('MM-DD')}</div>
              <div>{dayjs(checkOut).format('MM-DD')}</div>
            </div>
            <div onClick={() => setGuestPopupVisible(true)} style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}>
              <span style={{ fontSize: '11px', color: '#999' }}>{roomCount}间</span>
              <span style={{ fontSize: '11px', color: '#999' }}>{adultCount}人</span>
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={14} color="#999" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="位置/品牌/酒店"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              style={{
                width: '100%',
                background: '#F5F5F5',
                borderRadius: '20px',
                padding: '7px 12px 7px 30px',
                fontSize: '13px',
                border: 'none',
                outline: 'none',
                color: '#333',
              }}
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px', height: '40px', borderTop: '1px solid #F0F0F0' }}>
          <button
            onClick={() => setLocationPopupVisible(true)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px',
              fontSize: '13px', background: 'none', border: 'none',
              color: locationPopupVisible || selectedLocation ? '#2681FF' : '#333',
              fontWeight: locationPopupVisible || selectedLocation ? 600 : 400,
            }}
          >
            <span>位置距离</span>
            <ChevronDown size={12} color={locationPopupVisible || selectedLocation ? '#2681FF' : '#999'} />
          </button>
          <button
            onClick={() => setStarPopupVisible(true)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px',
              fontSize: '13px', background: 'none', border: 'none',
              color: selectedStar !== '不限' ? '#2681FF' : '#333',
              fontWeight: selectedStar !== '不限' ? 600 : 400,
            }}
          >
            <span>{selectedStar === '不限' ? '价格/星级' : selectedStar}</span>
            {selectedStar !== '不限' && (
              <span style={{ background: '#2681FF', color: '#fff', fontSize: '10px', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
            )}
            <ChevronDown size={12} color={selectedStar !== '不限' ? '#2681FF' : '#999'} />
          </button>
          <button
            onClick={() => setFilterPopupVisible(true)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px',
              fontSize: '13px', background: 'none', border: 'none',
              color: selectedTags.length > 0 ? '#2681FF' : '#333',
              fontWeight: selectedTags.length > 0 ? 600 : 400,
            }}
          >
            <span>筛选</span>
            {selectedTags.length > 0 && (
              <span style={{ background: '#2681FF', color: '#fff', fontSize: '10px', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{selectedTags.length}</span>
            )}
            <ChevronDown size={12} color={selectedTags.length > 0 ? '#2681FF' : '#999'} />
          </button>
        </div>

        {/* Quick Tags Scroll */}
        <div style={{ display: 'flex', gap: '8px', padding: '8px 12px', overflowX: 'auto', borderTop: '1px solid #F0F0F0' }} className="no-scrollbar">
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                border: selectedTags.includes(tag) ? '1px solid #2681FF' : '1px solid #E8E8E8',
                background: selectedTags.includes(tag) ? '#EBF3FF' : '#fff',
                color: selectedTags.includes(tag) ? '#2681FF' : '#666',
                fontWeight: selectedTags.includes(tag) ? 500 : 400,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* antd-mobile Popup — 位置距离 */}
      <Popup
        visible={locationPopupVisible}
        onMaskClick={() => setLocationPopupVisible(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: '70vh' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left: Categories */}
            <div style={{ width: '90px', background: '#F7F7F7', overflowY: 'auto', flexShrink: 0 }}>
              {locationCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setLocationCategory(cat)}
                  style={{
                    display: 'block', width: '100%', padding: '16px 0', border: 'none',
                    fontSize: '13px', textAlign: 'center',
                    background: locationCategory === cat ? '#fff' : 'transparent',
                    color: locationCategory === cat ? '#2681FF' : '#666',
                    fontWeight: locationCategory === cat ? 600 : 400,
                    borderLeft: locationCategory === cat ? '3px solid #2681FF' : '3px solid transparent',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Right: Location List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
              {(locationData[locationCategory] || []).map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => setSelectedLocation(selectedLocation === loc.name ? '' : loc.name)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left', padding: '14px 16px',
                    border: 'none', borderBottom: '1px solid #F5F5F5',
                    background: selectedLocation === loc.name ? '#EBF3FF' : '#fff',
                  }}
                >
                  <div style={{ fontSize: '14px', color: selectedLocation === loc.name ? '#2681FF' : '#1A1A1A', fontWeight: selectedLocation === loc.name ? 600 : 400 }}>{loc.name}</div>
                  {loc.pct && <div style={{ fontSize: '11px', color: selectedLocation === loc.name ? '#2681FF' : '#FF6600', marginTop: '2px' }}>{loc.pct} 用户选择</div>}
                </button>
              ))}
            </div>
          </div>
          {/* Bottom Buttons */}
          <div style={{ display: 'flex', gap: '12px', padding: '12px 16px', borderTop: '1px solid #F0F0F0' }}>
            <button
              onClick={() => { setSelectedLocation(''); }}
              style={{
                flex: 1, padding: '12px 0', borderRadius: '8px', fontSize: '15px',
                border: '1px solid #E8E8E8', background: '#fff', color: '#333',
              }}
            >
              清空
            </button>
            <button
              onClick={() => setLocationPopupVisible(false)}
              style={{
                flex: 1, padding: '12px 0', borderRadius: '8px', fontSize: '15px', fontWeight: 700,
                border: 'none', background: 'linear-gradient(135deg, #4A9AFF 0%, #2681FF 100%)', color: '#fff',
              }}
            >
              完成
            </button>
          </div>
        </div>
      </Popup>

      {/* antd-mobile Popup — 价格/星级 */}
      <Popup
        visible={starPopupVisible}
        onMaskClick={() => setStarPopupVisible(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: '75vh' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {/* 价格 */}
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A', marginBottom: '12px' }}>价格</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#999', marginBottom: '4px' }}>
              <span>0</span>
              <span>¥2200以上</span>
            </div>
            <div style={{ padding: '0 4px' }}>
              <Slider
                range
                min={0}
                max={2200}
                step={50}
                value={priceRange}
                onChange={(val) => { setPriceRange(val as [number, number]); setSelectedPriceLabel(''); }}
                style={{ '--fill-color': '#2681FF' } as React.CSSProperties}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '20px' }}>
              {priceRanges.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPriceLabel(selectedPriceLabel === p ? '' : p)}
                  style={{
                    padding: '10px 0', borderRadius: '6px', fontSize: '13px', textAlign: 'center',
                    border: selectedPriceLabel === p ? '1px solid #2681FF' : '1px solid #E8E8E8',
                    background: selectedPriceLabel === p ? '#EBF3FF' : '#fff',
                    color: selectedPriceLabel === p ? '#2681FF' : '#333',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* 星级/钻级 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', marginBottom: '14px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#1A1A1A' }}>星级/钻级</span>
              <span style={{ fontSize: '12px', color: '#2681FF' }}>国内星级/钻级说明 &gt;</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {starLevels.map((s) => (
                <button
                  key={s.label}
                  onClick={() => setSelectedStarLabel(selectedStarLabel === s.label ? '' : s.label)}
                  style={{
                    padding: '10px 0', borderRadius: '6px', textAlign: 'center',
                    border: selectedStarLabel === s.label ? '1px solid #2681FF' : '1px solid #E8E8E8',
                    background: selectedStarLabel === s.label ? '#EBF3FF' : '#fff',
                  }}
                >
                  <div style={{ fontSize: '13px', color: selectedStarLabel === s.label ? '#2681FF' : '#333', fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: '11px', color: selectedStarLabel === s.label ? '#2681FF' : '#999', marginTop: '2px' }}>{s.sub}</div>
                </button>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#999', marginTop: '16px', lineHeight: 1.6 }}>
              酒店未参加星级评定但设施服务达到相应水平，采用钻级分类，仅供参考
            </p>
          </div>
          {/* Bottom Buttons */}
          <div style={{ display: 'flex', gap: '12px', padding: '12px 16px', borderTop: '1px solid #F0F0F0' }}>
            <button
              onClick={() => { setSelectedPriceLabel(''); setSelectedStarLabel(''); setPriceRange([0, 2200]); setSelectedStar('不限'); }}
              style={{ flex: 1, padding: '12px 0', borderRadius: '8px', fontSize: '15px', border: '1px solid #E8E8E8', background: '#fff', color: '#333' }}
            >
              清空
            </button>
            <button
              onClick={() => {
                const parts = [selectedPriceLabel, selectedStarLabel].filter(Boolean);
                setSelectedStar(parts.length > 0 ? parts.join(',') : '不限');
                setStarPopupVisible(false);
              }}
              style={{ flex: 1, padding: '12px 0', borderRadius: '8px', fontSize: '15px', fontWeight: 700, border: 'none', background: 'linear-gradient(135deg, #4A9AFF 0%, #2681FF 100%)', color: '#fff' }}
            >
              完成
            </button>
          </div>
        </div>
      </Popup>

      {/* antd-mobile Popup — 筛选 */}
      <Popup
        visible={filterPopupVisible}
        onMaskClick={() => setFilterPopupVisible(false)}
        bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', height: '75vh' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left: Categories */}
            <div style={{ width: '90px', background: '#F7F7F7', overflowY: 'auto', flexShrink: 0 }}>
              {filterCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  style={{
                    display: 'block', width: '100%', padding: '16px 0', border: 'none',
                    fontSize: '13px', textAlign: 'center',
                    background: filterCategory === cat ? '#fff' : 'transparent',
                    color: filterCategory === cat ? '#2681FF' : '#666',
                    fontWeight: filterCategory === cat ? 600 : 400,
                    borderLeft: filterCategory === cat ? '3px solid #2681FF' : '3px solid transparent',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Right: Tag Grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A', marginBottom: '12px' }}>{filterCategory}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {(filterData[filterCategory] || []).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: '10px 4px', borderRadius: '6px', fontSize: '12px', textAlign: 'center',
                      border: selectedTags.includes(tag) ? '1px solid #2681FF' : '1px solid #E8E8E8',
                      background: selectedTags.includes(tag) ? '#EBF3FF' : '#fff',
                      color: selectedTags.includes(tag) ? '#2681FF' : '#333',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Bottom Buttons */}
          <div style={{ display: 'flex', gap: '12px', padding: '12px 16px', borderTop: '1px solid #F0F0F0' }}>
            <button
              onClick={() => setSelectedTags([])}
              style={{ flex: 1, padding: '12px 0', borderRadius: '8px', fontSize: '15px', border: '1px solid #E8E8E8', background: '#fff', color: '#333' }}
            >
              清空
            </button>
            <button
              onClick={() => setFilterPopupVisible(false)}
              style={{ flex: 1, padding: '12px 0', borderRadius: '8px', fontSize: '15px', fontWeight: 700, border: 'none', background: 'linear-gradient(135deg, #4A9AFF 0%, #2681FF 100%)', color: '#fff' }}
            >
              完成
            </button>
          </div>
        </div>
      </Popup>

      {/* Hotel List */}
      <div style={{ flex: 1, padding: '8px 12px 16px' }}>
        {filteredHotels.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: '#CCC' }}>
            <Search size={40} color="#DDD" />
            <p style={{ marginTop: '12px', fontSize: '14px', color: '#999' }}>未找到符合条件的酒店</p>
            <p style={{ fontSize: '12px', marginTop: '4px', color: '#CCC' }}>请尝试更换筛选条件</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.id}
                onClick={() => navigate(`/hotel/${hotel.id}`)}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', padding: '12px', gap: '10px' }}>
                  {/* Image */}
                  <div style={{ width: '110px', height: '110px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    <img src={hotel.images[0]} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    {/* Title + Stars + Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1A1A1A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                        {hotel.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '1px', flexShrink: 0 }}>
                        {renderStars(hotel.stars)}
                      </div>
                      <span style={{
                        fontSize: '10px', padding: '1px 4px', borderRadius: '2px', flexShrink: 0,
                        background: hotel.stars >= 4 ? '#FFF7E6' : '#F5F5F5',
                        color: hotel.stars >= 4 ? '#FF8C00' : '#999',
                        border: hotel.stars >= 4 ? '1px solid #FFD591' : '1px solid #E8E8E8',
                      }}>
                        {getStarLabel(hotel.stars)}
                      </span>
                    </div>

                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{
                        background: '#2681FF', color: '#fff', fontSize: '11px',
                        padding: '1px 5px', borderRadius: '4px', fontWeight: 700,
                      }}>
                        {hotel.rating}
                      </span>
                      <span style={{ fontSize: '12px', color: '#2681FF', fontWeight: 600 }}>{hotel.ratingText}</span>
                      <span style={{ fontSize: '11px', color: '#999' }}>
                        {hotel.reviewCount}点评 · {formatCount(hotel.favoriteCount)}收藏
                      </span>
                    </div>

                    {/* Location */}
                    <p style={{ fontSize: '12px', color: '#999', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {hotel.distance}
                    </p>

                    {/* Highlight */}
                    <p style={{ fontSize: '12px', color: '#333', fontWeight: 600, margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {hotel.highlights[0]}
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap', overflow: 'hidden' }}>
                      {hotel.tags.slice(0, 4).map((tag, idx) => (
                        <span key={tag} style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '2px',
                          whiteSpace: 'nowrap',
                          border: idx === 0 ? '1px solid #FFDCB8' : '1px solid #E8E8E8',
                          color: idx === 0 ? '#FF6600' : '#666',
                          background: idx === 0 ? '#FFF7EB' : '#fff',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom: Ranking + Price */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0 12px 12px', marginTop: '-2px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '12px' }}>🏆</span>
                    <span style={{ fontSize: '11px', color: '#999' }}>{hotel.description}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', flexShrink: 0 }}>
                    <span style={{ fontSize: '11px', color: '#CCC', textDecoration: 'line-through' }}>¥{hotel.originalPrice}</span>
                    <span style={{ fontSize: '11px', color: '#FF6600' }}>¥</span>
                    <span style={{ fontSize: '22px', fontWeight: 700, color: '#FF6600', lineHeight: 1 }}>{hotel.price}</span>
                    <span style={{ fontSize: '11px', color: '#FF6600' }}>起</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#CCC', padding: '20px 0' }}>
          — 共{filteredHotels.length}家酒店 · {nights}晚 —
        </div>
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
    </div>
  );
};

export default HotelList;
