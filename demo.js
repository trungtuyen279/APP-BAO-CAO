/* =====================================================================
   demo.js — TÀI KHOẢN XEM THỬ (3.18.1) · App BÁO CÁO CÔNG VIỆC BCH · LICOGI13FC
   - Chỉ tải khi đăng nhập tài khoản xem thử. Người dùng thật KHÔNG tải file này.
   - Toàn bộ số liệu là MÔ PHỎNG, sinh ngay trên máy; không gọi máy chủ, không đọc Google Sheets.
   - Mọi thao tác ghi đều bị chặn (báo "Tài khoản xem thử — không lưu dữ liệu").
   ===================================================================== */
(function(){
'use strict';
const XT_MSG = 'Tài khoản xem thử — chỉ xem, không lưu dữ liệu.';
const DA1 = 'DEMO-KTX', DA2 = 'DEMO-NX';
const EM = 'xemthu@licogi13fc.vn';
const pad = n => String(n).padStart(2, '0');
const iso = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const vn = d => pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
const HOM = new Date(); HOM.setHours(9, 0, 0, 0);
const ngay = n => { const d = new Date(HOM); d.setDate(d.getDate() + n); return d; };
const thangOf = d => d.getFullYear() + '-' + pad(d.getMonth() + 1);
const THANG_NAY = thangOf(HOM);
const THANG_TRUOC = thangOf(new Date(HOM.getFullYear(), HOM.getMonth() - 1, 1));
const lui = k => thangOf(new Date(HOM.getFullYear(), HOM.getMonth() - k, 1));
let seed = 13;
const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
const r2 = v => Math.round(v * 100) / 100;
const clone = o => JSON.parse(JSON.stringify(o));

/* ---------------- NHÂN SỰ MÔ PHỎNG ---------------- */
const NS = [
  {email:'cht.ktx@vidu.vn', hoTen:'Nguyễn Văn An', vt:'CHT', da:DA1, vaiTro:'CHT_DUYET'},
  {email:'chp.ktx@vidu.vn', hoTen:'Trần Văn Bình', vt:'CHP_HT', da:DA1, vaiTro:'CHT_DUYET'},
  {email:'qs.ktx@vidu.vn', hoTen:'Lê Thị Chi', vt:'QS', da:DA1, vaiTro:'QS'},
  {email:'kt1.ktx@vidu.vn', hoTen:'Phạm Văn Dũng', vt:'CBKT', da:DA1, vaiTro:'KT_NHAP'},
  {email:'kt2.ktx@vidu.vn', hoTen:'Hoàng Văn Em', vt:'CBKT', da:DA1, vaiTro:'KT_NHAP'},
  {email:'kt3.ktx@vidu.vn', hoTen:'Đỗ Thị Giang', vt:'CBKT', da:DA1, vaiTro:'KT_NHAP'},
  {email:'kho.ktx@vidu.vn', hoTen:'Vũ Văn Hùng', vt:'THU_KHO', da:DA1, vaiTro:'KT_NHAP'},
  {email:'kt.ktx@vidu.vn', hoTen:'Bùi Thị Hoa', vt:'KE_TOAN', da:DA1, vaiTro:'KE_TOAN'},
  {email:'cht.nx@vidu.vn', hoTen:'Ngô Văn Khánh', vt:'CHT', da:DA2, vaiTro:'CHT_DUYET'},
  {email:'chp.nx@vidu.vn', hoTen:'Đặng Văn Lâm', vt:'CHP_HT', da:DA2, vaiTro:'CHT_DUYET'},
  {email:'kt1.nx@vidu.vn', hoTen:'Trịnh Văn Minh', vt:'CBKT', da:DA2, vaiTro:'KT_NHAP'},
  {email:'kt2.nx@vidu.vn', hoTen:'Lý Thị Nga', vt:'CBKT', da:DA2, vaiTro:'KT_NHAP'},
  {email:'shop.nx@vidu.vn', hoTen:'Mai Văn Phúc', vt:'SHOP', da:DA2, vaiTro:'KT_NHAP'}
];
const TEN_VT = {CHT:'Chỉ huy trưởng', CHP_HT:'Chỉ huy phó hiện trường', CHP_VP:'Chỉ huy phó văn phòng', QS:'Cán bộ QS', CBKT:'Cán bộ kỹ thuật hiện trường',
  THU_KHO:'Thủ kho', KE_TOAN:'Kế toán hiện trường', SHOP:'Cán bộ Shopdrawing'};
const nsTen = e => (NS.find(x => x.email === e) || {}).hoTen || e;

/* ---------------- DỰ ÁN + DANH MỤC ---------------- */
const DUAN = [
  {maDA:DA1, tenDA:'Ký túc xá chuyên gia (dự án mô phỏng)', diaDiem:'KCN mô phỏng, Hà Nam', ngayBD:iso(ngay(-260)), ngayKT:iso(ngay(210))},
  {maDA:DA2, tenDA:'Nhà xưởng sản xuất (dự án mô phỏng)', diaDiem:'KCN mô phỏng, Hà Nam', ngayBD:iso(ngay(-150)), ngayKT:iso(ngay(120))}
];
/* [phân khu, zone, mã, tên, đvt, KL HĐ, đơn giá (đ), %đã làm, ngàyBĐ, ngàyKT (so với hôm nay), người PT, quan trọng, mã TP] */
const VIEC = [
  [DA1, 'Block A · Kết cấu', 'Tầng 7', 'KC-01', 'Cốt thép cột, vách', 'tấn', 42, 21500000, 1, -40, -22, 'Phạm Văn Dũng', 0, ''],
  [DA1, 'Block A · Kết cấu', 'Tầng 7', 'KC-02', 'Bê tông cột, vách M400', 'm3', 118, 1650000, 1, -35, -20, 'Phạm Văn Dũng', 0, ''],
  [DA1, 'Block A · Kết cấu', 'Tầng 8', 'KC-01', 'Cốt thép cột, vách', 'tấn', 41, 21500000, 0.92, -18, 3, 'Phạm Văn Dũng', 0, ''],
  [DA1, 'Block A · Kết cấu', 'Tầng 8', 'KC-03', 'Cốp pha dầm sàn', 'm2', 1460, 185000, 0.78, -14, 4, 'Phạm Văn Dũng', 1, ''],
  [DA1, 'Block A · Kết cấu', 'Tầng 8', 'KC-04', 'Bê tông dầm sàn M350', 'm3', 286, 1580000, 0.35, -5, 6, 'Phạm Văn Dũng', 1, ''],
  [DA1, 'Block A · Kết cấu', 'Tầng 9', 'KC-01', 'Cốt thép cột, vách', 'tấn', 41, 21500000, 0.1, -2, 12, 'Phạm Văn Dũng', 0, ''],
  [DA1, 'Block B · Kết cấu', 'Tầng 5', 'KC-03', 'Cốp pha dầm sàn', 'm2', 1380, 185000, 1, -30, -16, 'Hoàng Văn Em', 0, ''],
  [DA1, 'Block B · Kết cấu', 'Tầng 6', 'KC-01', 'Cốt thép cột, vách', 'tấn', 38, 21500000, 0.64, -12, 2, 'Hoàng Văn Em', 1, ''],
  [DA1, 'Block B · Kết cấu', 'Tầng 6', 'KC-04', 'Bê tông dầm sàn M350', 'm3', 264, 1580000, 0.0, 3, 12, 'Hoàng Văn Em', 0, ''],
  [DA1, 'Hoàn thiện · Block A', 'Tầng 2–4', 'HT-01', 'Xây tường gạch AAC 100', 'm2', 3150, 265000, 0.82, -45, 10, 'Đỗ Thị Giang', 0, 'TP-02'],
  [DA1, 'Hoàn thiện · Block A', 'Tầng 2–4', 'HT-02', 'Trát tường trong', 'm2', 6100, 98000, 0.55, -30, 18, 'Đỗ Thị Giang', 0, 'TP-02'],
  [DA1, 'Hoàn thiện · Block A', 'Tầng 2–4', 'HT-03', 'Chống thấm sàn WC', 'm2', 640, 210000, 0.4, -12, 15, 'Đỗ Thị Giang', 1, 'TP-02'],
  [DA1, 'Hoàn thiện · Block A', 'Tầng 2–4', 'HT-04', 'Lát gạch nền 600x600', 'm2', 2850, 245000, 0.12, -4, 30, 'Đỗ Thị Giang', 0, 'TP-02'],
  [DA1, 'MEP · Block A', 'Tầng 1–4', 'ME-01', 'Ống cấp thoát nước PPR/uPVC', 'm', 4200, 145000, 0.6, -40, 20, 'Hoàng Văn Em', 0, 'TP-03'],
  [DA1, 'MEP · Block A', 'Tầng 1–4', 'ME-02', 'Máng cáp, ống luồn dây điện', 'm', 5600, 120000, 0.48, -35, 25, 'Hoàng Văn Em', 0, 'TP-03'],
  [DA1, 'MEP · Block A', 'Tầng 1–4', 'ME-03', 'Thang máy 2 bộ', 'bộ', 2, 1450000000, 0, 20, 110, 'Trần Văn Bình', 1, 'TP-01'],
  [DA1, 'Hạ tầng ngoài nhà', '', 'HN-01', 'Đào đất hố ga, mương thoát nước', 'm3', 920, 85000, 0.7, -25, 8, 'Trần Văn Bình', 0, ''],
  [DA1, 'Hạ tầng ngoài nhà', '', 'HN-02', 'Bê tông mặt đường nội bộ', 'm2', 2400, 420000, 0, 25, 70, 'Trần Văn Bình', 0, ''],
  [DA2, 'Móng · Nhà xưởng', 'Trục 1–12', 'MO-01', 'Bê tông lót móng', 'm3', 96, 1150000, 1, -120, -95, 'Trịnh Văn Minh', 0, ''],
  [DA2, 'Móng · Nhà xưởng', 'Trục 1–12', 'MO-02', 'Bê tông móng, giằng M300', 'm3', 640, 1520000, 1, -110, -70, 'Trịnh Văn Minh', 0, ''],
  [DA2, 'Kết cấu thép', 'Trục 1–12', 'KT-01', 'Lắp dựng cột, kèo thép', 'tấn', 310, 32000000, 0.86, -60, 6, 'Đặng Văn Lâm', 1, 'TP-04'],
  [DA2, 'Kết cấu thép', 'Trục 1–12', 'KT-02', 'Xà gồ mái, giằng mái', 'tấn', 88, 29500000, 0.62, -35, 10, 'Đặng Văn Lâm', 0, 'TP-04'],
  [DA2, 'Bao che & mái', 'Trục 1–12', 'BC-01', 'Tôn mái + cách nhiệt', 'm2', 9800, 365000, 0.28, -12, 25, 'Lý Thị Nga', 1, 'TP-04'],
  [DA2, 'Bao che & mái', 'Trục 1–12', 'BC-02', 'Tôn vách bao che', 'm2', 4300, 310000, 0.05, -2, 35, 'Lý Thị Nga', 0, 'TP-04'],
  [DA2, 'Nền xưởng', 'Trục 1–12', 'NE-01', 'Đầm chặt nền, lớp cấp phối', 'm2', 9600, 125000, 0.9, -30, -2, 'Trịnh Văn Minh', 0, ''],
  [DA2, 'Nền xưởng', 'Trục 1–12', 'NE-02', 'Bê tông nền tăng cứng bề mặt', 'm2', 9600, 465000, 0, 8, 45, 'Trịnh Văn Minh', 1, '']
];
const danhmuc = [], luyke = {}, tt = {};
VIEC.forEach((v, i) => {
  const [maDA, khu, zone, ma, ten, dv, kl, dg, pct, bd, kt, pt, qt, tp] = v;
  const tinhTrang = pct >= 1 ? 'HOAN_THANH' : pct > 0 ? (kt < 0 ? 'CHAM' : 'DANG_THI_CONG') : 'CHUA_BAT_DAU';
  danhmuc.push({maDA, stt:i + 1, maViec:ma, tenViec:ten, phanKhu:khu, zone, maTP:tp, donVi:dv, klHopDong:kl, giaTri:kl * dg,
    nguoiPT:pt, ngayBD:iso(ngay(bd)), ngayKT:iso(ngay(kt)), nhanLuc:Math.round(4 + rnd() * 14), tinhTrang, quanTrong:!!qt});
  if (pct > 0) luyke[kViec(maDA, khu, zone, ma)] = r2(kl * pct);
});
const tomTatKhu = [];
danhmuc.forEach(x => {
  const k = x.maDA + '|' + x.phanKhu;
  let o = tomTatKhu.find(t => t.maDA + '|' + t.khu === k);
  if (!o){ o = {maDA:x.maDA, khu:x.phanKhu, soViec:0, giaTri:0, giaTriXong:0, klTong:0, klXong:0, xong:0, _p:0}; tomTatKhu.push(o); }
  const da = Math.min(x.klHopDong, luyke[kViec(x.maDA, x.phanKhu, x.zone, x.maViec)] || 0), p = x.klHopDong ? da / x.klHopDong : 0;
  o.soViec++; o.giaTri += x.giaTri; o.klTong += x.klHopDong; o.klXong += da; o.giaTriXong += x.giaTri * p; o._p += p * 100; if (p >= 0.995) o.xong++;
});
tomTatKhu.forEach(o => { o.pctTB = Math.round(o._p / o.soViec * 10) / 10; o.duGia = true; delete o._p; });

/* ---------------- NHẬT KÝ 14 NGÀY ---------------- */
const logs = [];
let idL = 1;
for (let n = 0; n < 14; n++){
  const d = ngay(-n);
  if (d.getDay() === 0) continue;
  danhmuc.filter(x => x.tinhTrang === 'DANG_THI_CONG' || x.tinhTrang === 'CHAM').forEach((x, j) => {
    if (rnd() < 0.45) return;
    const nv = NS.find(s => s.hoTen === x.nguoiPT) || NS[3];
    const kl = r2(x.klHopDong * (0.01 + rnd() * 0.025));
    logs.push({id:'XT-L' + (idL++), ngay:vn(d), maDA:x.maDA, phanKhu:x.phanKhu, zone:x.zone, viTri:x.zone, maViec:x.maViec, tenViec:x.tenViec,
      nguoiNhap:nv.email, khoiLuong:kl, donVi:x.donVi, nhanCong:Math.round(6 + rnd() * 16),
      vuongMac: rnd() < 0.18 ? ['Chờ TVGS nghiệm thu cốt thép', 'Mưa lớn buổi chiều, dừng 2 giờ', 'Thiếu 1 xe bơm, chờ điều xe', 'Chờ bản vẽ sửa đổi rev.2'][Math.floor(rnd() * 4)] : '',
      anh:[], hoTen:nv.hoTen, trangThai: n <= 1 ? 'CHO_DUYET' : (rnd() < 0.06 ? 'TRA_LAI' : 'DA_DUYET')});
  });
}

/* ---------------- THÔNG BÁO ---------------- */
const tg = (n, h) => { const d = ngay(n); d.setHours(h, 15, 0, 0); return d.toISOString(); };
const notis = [
  {id:'XT-TB1', maDA:DA1, loai:'Chỉ thị công trường', tieuDe:'Đổ bê tông sàn tầng 8 Block A ngày mai', noiDung:'Đổ bê tông dầm sàn tầng 8 Block A từ 7h00. Tổ cốt thép hoàn thiện, CBKT mời TVGS nghiệm thu trước 16h hôm nay. Bơm cần 2 xe, dự kiến 286 m³.', mucDo:'Khẩn', nguoiGui:'Nguyễn Văn An', thoiGian:tg(0, 8), daXacNhan:null, thongKe:'9/12 người', rieng:false},
  {id:'XT-TB2', maDA:DA1, loai:'An toàn lao động', tieuDe:'Kiểm tra lan can, lưới an toàn từ tầng 6 trở lên', noiDung:'Ban ATLĐ kiểm tra lúc 14h. Các tổ đội khắc phục ngay lan can tạm và lưới bao che mép sàn.', mucDo:'Quan trọng', nguoiGui:'Trần Văn Bình', thoiGian:tg(-1, 10), daXacNhan:tg(-1, 11), thongKe:'12/12 người', rieng:false},
  {id:'XT-TB3', maDA:DA2, loai:'Thông báo BCH', tieuDe:'Lịch nghiệm thu kết cấu thép trục 7–12', noiDung:'TVGS nghiệm thu bu lông neo và liên kết kèo trục 7–12 vào 9h thứ Năm. CBKT chuẩn bị hồ sơ vật liệu và biên bản nội bộ.', mucDo:'Thông thường', nguoiGui:'Ngô Văn Khánh', thoiGian:tg(-2, 16), daXacNhan:null, thongKe:'6/8 người', rieng:false},
  {id:'XT-TB5', maDA:DA1, loai:'Văn bản CĐT/TVGS', tieuDe:'CĐT chấp thuận mẫu gạch lát nền 600x600', noiDung:'Văn bản số 15/CĐT-QLDA (mô phỏng): chấp thuận mẫu gạch lát 600x600 màu xám nhạt. BCH triển khai đặt hàng đợt 1.', mucDo:'Thông thường', nguoiGui:'Lê Thị Chi', thoiGian:tg(-4, 15), daXacNhan:tg(-4, 16), thongKe:'10/12 người', rieng:false},
  {id:'XT-TB4', maDA:DA1, loai:'Thông báo BCH', tieuDe:'Nhắc chấm KPI tháng trước (ngày 01–03)', noiDung:'Mọi người vào KPI → Của tôi để tự chấm. CHP chấm và gửi duyệt trước ngày 03.', mucDo:'Thông thường', nguoiGui:'Quản trị hệ thống', thoiGian:tg(-3, 7), daXacNhan:tg(-3, 9), thongKe:'11/12 người', rieng:false}
];

/* ---------------- THẦU PHỤ / NCC / TỔ ĐỘI / SỔ TAY ---------------- */
const TP = [
  {maDA:DA1, maTP:'TP-01', tenTP:'Công ty Thang máy Mô Phỏng', hangMuc:'Thang máy 2 bộ', giaTri:2900000000, buoc:5, ngayKy:vn(ngay(-60)), nguoiLienHe:'A. Tùng', dienThoai:'0900000001', ghiChu:'Lead-time 110 ngày, nằm trên đường găng'},
  {maDA:DA1, maTP:'TP-02', tenTP:'Công ty Hoàn thiện Mẫu A', hangMuc:'Xây trát, chống thấm, ốp lát', giaTri:4600000000, buoc:7, ngayKy:vn(ngay(-90)), nguoiLienHe:'A. Quân', dienThoai:'0900000002', ghiChu:''},
  {maDA:DA1, maTP:'TP-03', tenTP:'Công ty Cơ điện Mẫu B', hangMuc:'Điện nước trong nhà', giaTri:3800000000, buoc:7, ngayKy:vn(ngay(-80)), nguoiLienHe:'C. Hạnh', dienThoai:'0900000003', ghiChu:'Thiếu nhân lực đợt cao điểm, đã nhắc bằng văn bản'},
  {maDA:DA2, maTP:'TP-04', tenTP:'Công ty Kết cấu thép Mẫu C', hangMuc:'Kết cấu thép + bao che', giaTri:16500000000, buoc:7, ngayKy:vn(ngay(-100)), nguoiLienHe:'A. Sơn', dienThoai:'0900000004', ghiChu:''},
  {maDA:DA2, maTP:'TP-05', tenTP:'Công ty PCCC Mẫu D', hangMuc:'Hệ thống chữa cháy', giaTri:2100000000, buoc:3, ngayKy:'', nguoiLienHe:'A. Long', dienThoai:'0900000005', ghiChu:'Đang trình mẫu vật tư, chờ CĐT duyệt'}
];
TP.forEach(tp => {
  tp.viec = danhmuc.filter(x => x.maDA === tp.maDA && x.maTP === tp.maTP).map(v => {
    const lk = luyke[kViec(v.maDA, v.phanKhu, v.zone, v.maViec)] || 0;
    return {maViec:v.maViec, tenViec:v.tenViec, phanKhu:v.phanKhu, donVi:v.donVi, klHopDong:v.klHopDong, giaTri:v.giaTri, daLam:r2(lk), pct:Math.round(v.klHopDong ? Math.min(100, lk / v.klHopDong * 100) : 0)};
  });
  const g = tp.viec.reduce((s, v) => s + v.giaTri, 0);
  tp.giaTriGoi = g; tp.theoGiaTri = g > 0; tp.soViec = tp.viec.length;
  tp.pctGoi = tp.viec.length ? Math.round(tp.viec.reduce((s, v) => s + v.pct * v.giaTri, 0) / (g || 1)) : null;
});
const ncc = [
  {maDA:DA1, maNCC:'NCC-01', tenNCC:'Bê tông thương phẩm Mẫu 1', nhom:'Bê tông', vatTu:'Bê tông M300–M400', leadTime:1, nguoiLienHe:'A. Hải', dienThoai:'0900000011', ghiChu:'Báo trước 24h'},
  {maDA:DA1, maNCC:'NCC-02', tenNCC:'Thép xây dựng Mẫu 2', nhom:'Vật tư chính', vatTu:'Thép D10–D32', leadTime:5, nguoiLienHe:'C. Lan', dienThoai:'0900000012', ghiChu:''},
  {maDA:DA1, maNCC:'NCC-03', tenNCC:'Gạch AAC Mẫu 3', nhom:'Vật tư hoàn thiện', vatTu:'Gạch AAC 100/200', leadTime:4, nguoiLienHe:'A. Đức', dienThoai:'0900000013', ghiChu:''},
  {maDA:DA2, maNCC:'NCC-04', tenNCC:'Bê tông thương phẩm Mẫu 4', nhom:'Bê tông', vatTu:'Bê tông M250–M350', leadTime:1, nguoiLienHe:'A. Nam', dienThoai:'0900000014', ghiChu:''},
  {maDA:DA1, maNCC:'NCC-06', tenNCC:'Cho thuê cẩu tháp Mẫu 6', nhom:'Thiết bị', vatTu:'Cẩu tháp 8T, vận thăng', leadTime:7, nguoiLienHe:'A. Phong', dienThoai:'0900000016', ghiChu:'Kiểm định còn hạn 4 tháng'},
  {maDA:DA1, maNCC:'NCC-07', tenNCC:'Thí nghiệm vật liệu Mẫu 7', nhom:'Dịch vụ', vatTu:'Nén mẫu bê tông, kéo thép', leadTime:2, nguoiLienHe:'C. Mai', dienThoai:'0900000017', ghiChu:''},
  {maDA:DA2, maNCC:'NCC-05', tenNCC:'Tôn mái Mẫu 5', nhom:'Vật tư chính', vatTu:'Tôn 0,47 mm + PU', leadTime:10, nguoiLienHe:'C. Thu', dienThoai:'0900000015', ghiChu:'Đặt hàng theo đợt 2.000 m²'}
];
const toDoi = [
  {maDA:DA1, maTo:'TO-01', tenTo:'Tổ cốt thép số 1', thauPhu:'Nhân công Mẫu E', congViec:'Gia công, lắp dựng cốt thép', viTri:'Block A tầng 8–9', quanSo:22, doiTruong:'A. Bình', dienThoai:'0900000021', trangThai:'DANG_LAM'},
  {maDA:DA1, maTo:'TO-02', tenTo:'Tổ cốp pha số 2', thauPhu:'Nhân công Mẫu E', congViec:'Cốp pha dầm sàn', viTri:'Block A tầng 8', quanSo:18, doiTruong:'A. Cường', dienThoai:'0900000022', trangThai:'DANG_LAM'},
  {maDA:DA1, maTo:'TO-03', tenTo:'Tổ nề hoàn thiện', thauPhu:'Công ty Hoàn thiện Mẫu A', congViec:'Xây trát', viTri:'Block A tầng 2–4', quanSo:26, doiTruong:'A. Dân', dienThoai:'0900000023', trangThai:'DANG_LAM'},
  {maDA:DA1, maTo:'TO-04', tenTo:'Tổ điện nước', thauPhu:'Công ty Cơ điện Mẫu B', congViec:'Ống, máng cáp', viTri:'Block A tầng 1–4', quanSo:12, doiTruong:'A. Giáp', dienThoai:'0900000024', trangThai:'DANG_LAM'},
  {maDA:DA2, maTo:'TO-05', tenTo:'Tổ lắp dựng thép', thauPhu:'Công ty Kết cấu thép Mẫu C', congViec:'Lắp kèo, xà gồ', viTri:'Trục 7–12', quanSo:20, doiTruong:'A. Hiếu', dienThoai:'0900000025', trangThai:'DANG_LAM'},
  {maDA:DA2, maTo:'TO-06', tenTo:'Tổ lợp mái', thauPhu:'Công ty Kết cấu thép Mẫu C', congViec:'Tôn mái, cách nhiệt', viTri:'Trục 1–6', quanSo:14, doiTruong:'A. Khoa', dienThoai:'0900000026', trangThai:'DANG_LAM'}
];
const soTay = [
  {maDA:'TAT_CA', chuyenNganh:'Kết cấu', tenTL:'Biện pháp thi công bê tông dầm sàn (mẫu)', moTa:'Tài liệu minh họa', link:'https://www.licogi13fc.com.vn'},
  {maDA:'TAT_CA', chuyenNganh:'An toàn', tenTL:'Nội quy an toàn lao động công trường (mẫu)', moTa:'Tài liệu minh họa', link:'https://www.licogi13fc.com.vn'},
  {maDA:DA1, chuyenNganh:'Chống thấm', tenTL:'Chỉ dẫn chống thấm sàn WC (mẫu)', moTa:'Tài liệu minh họa', link:'https://www.licogi13fc.com.vn'},
  {maDA:DA2, chuyenNganh:'Kết cấu thép', tenTL:'Quy trình nghiệm thu bu lông liên kết (mẫu)', moTa:'Tài liệu minh họa', link:'https://www.licogi13fc.com.vn'}
];
const tienDoCS = [];
[[DA1, 'Block A', 'Kết cấu tầng 7', -60, -20, 100], [DA1, 'Block A', 'Kết cấu tầng 8', -20, 5, 62], [DA1, 'Block A', 'Kết cấu tầng 9', 3, 25, 4],
 [DA1, 'Block B', 'Kết cấu tầng 6', -15, 10, 45], [DA1, 'Block A', 'Xây trát tầng 2–4', -45, 15, 68], [DA1, 'Block A', 'MEP tầng 1–4', -40, 30, 52],
 [DA2, 'Nhà xưởng', 'Móng, giằng', -120, -70, 100], [DA2, 'Nhà xưởng', 'Kết cấu thép', -60, 8, 80], [DA2, 'Nhà xưởng', 'Mái, bao che', -15, 35, 20], [DA2, 'Nhà xưởng', 'Nền xưởng', -30, 45, 42]]
  .forEach((r, i) => tienDoCS.push({maDA:r[0], maCS:'CS' + (i + 1), khoi:r[1], congTac:r[2], tenViec:r[2], nguoiPT:'', bdCS:iso(ngay(r[3])), ktCS:iso(ngay(r[4])), soNgay:r[4] - r[3], trongSo:r[4] - r[3], pctHT:r[5]}));

/* ---------------- BÊ TÔNG ---------------- */
const keHoachDo = [
  {maPhieu:'BT-XT-01', maDA:DA1, ngayDK:iso(ngay(1)), khoi:'Block A', cauKien:'Dầm sàn tầng 8, trục 1–8', maViec:'KC-04', macBT:'M350 R28 S14', klKH:286, ncc:'Bê tông thương phẩm Mẫu 1', qs:'Lê Thị Chi', ghiChu:'2 bơm cần 47m'},
  {maPhieu:'BT-XT-02', maDA:DA2, ngayDK:iso(ngay(4)), khoi:'Nhà xưởng', cauKien:'Nền xưởng đợt 1, trục 1–4', maViec:'NE-02', macBT:'M300 R28', klKH:420, ncc:'Bê tông thương phẩm Mẫu 4', qs:'Mai Văn Phúc', ghiChu:''}
];
const doBT = [
  {id:'XT-BT1', maPhieu:'BT-XT-00', maDA:DA1, ngayDo:iso(ngay(-6)), khoi:'Block A', cauKien:'Cột vách tầng 8', macBT:'M400 R28', klKH:64, klTT:66.5, lech:2.5, pctLech:3.9, soXe:9, caBom:1, klBom:66.5,
   ncc:'Bê tông thương phẩm Mẫu 1', nguyenNhan:'Do tổ đội', lyDo:'Hở cốp pha chân vách trục 4', hoTen:'Phạm Văn Dũng', trangThai:'DA_DUYET', hanBao:'', daBao:tg(-5, 9), anh:{}},
  {id:'XT-BT2', maPhieu:'BT-XT-03', maDA:DA1, ngayDo:iso(ngay(-2)), khoi:'Block B', cauKien:'Cột vách tầng 6', macBT:'M400 R28', klKH:58, klTT:58, lech:0, pctLech:0, soXe:8, caBom:1, klBom:58,
   ncc:'Bê tông thương phẩm Mẫu 1', nguyenNhan:'', lyDo:'', hoTen:'Hoàng Văn Em', trangThai:'CHO_DUYET', hanBao:'', daBao:'', anh:{}},
  {id:'XT-BT3', maPhieu:'BT-XT-04', maDA:DA2, ngayDo:iso(ngay(-9)), khoi:'Nhà xưởng', cauKien:'Giằng móng trục 9–12', macBT:'M300 R28', klKH:72, klTT:70.8, lech:-1.2, pctLech:-1.7, soXe:9, caBom:1, klBom:70.8,
   ncc:'Bê tông thương phẩm Mẫu 4', nguyenNhan:'QS tính dư', lyDo:'Trừ thể tích bu lông neo, hộp kỹ thuật', hoTen:'Trịnh Văn Minh', trangThai:'DA_DUYET', hanBao:'', daBao:'', anh:{}}
];
const macBT = [{maDA:DA1, mac:'M350 R28 S14', apDung:'', ghiChu:''}, {maDA:DA1, mac:'M400 R28', apDung:'', ghiChu:''}, {maDA:DA2, mac:'M300 R28', apDung:'', ghiChu:''}];
const nccBT = [{maDA:DA1, ten:'Bê tông thương phẩm Mẫu 1'}, {maDA:DA2, ten:'Bê tông thương phẩm Mẫu 4'}];
const troLy = [
  {maDA:DA1, ngay:iso(HOM), buoi:'SANG', tieuDe:'3 việc cần chú ý hôm nay', noiDung:'1) Bê tông dầm sàn tầng 8 Block A đang chậm 35% so với kế hoạch — ưu tiên tổ cốp pha. 2) 4 báo cáo khối lượng chờ duyệt. 3) Thang máy cần chốt mặt bằng hố pit trước 2 tuần.', nguon:'Mô phỏng'},
  {maDA:DA2, ngay:iso(HOM), buoi:'SANG', tieuDe:'Mái tôn là đường găng', noiDung:'Tôn mái mới đạt 28%. Đề nghị tăng 1 tổ lợp mái từ tuần sau để kịp mốc kín mái.', nguon:'Mô phỏng'}
];
const USER = {email:EM, hoTen:'Khách xem thử', vaiTro:'ADMIN', duAn:[DA1, DA2], phamVi:[], viTriKPI:'CHT'};

function bootstrap(){
  return clone({duan:DUAN, danhmuc, luyke, logs, notis, thauPhu:TP, ncc, toDoi, soTay, tienDoCS, keHoachDo, doBT, macBT, nccBT, tomTatKhu, dmLon:false,
    svVer:(typeof APP_VERSION !== 'undefined' ? APP_VERSION : '3.18.1'), troLy, quyenTT:true, quyenSuaDM:true, chuHeThong:false, nhanSuDA:NS.map(x => x.hoTen).sort(), user:USER, token:'XEMTHU'});
}

/* ---------------- BÁO CÁO SÁNG + NHÂN LỰC ---------------- */
const TO_TEN = toDoi.map(t => t.tenTo);
function bcsNgay(maDA, d){
  const ds = toDoi.filter(t => t.maDA === maDA);
  return ds.map((t, i) => ({id:'XT-BCS-' + maDA + '-' + iso(d) + '-' + i, ngay:iso(d), khuVuc:t.viTri, toDoi:[{ten:t.tenTo, qs:Math.max(4, t.quanSo - Math.floor(rnd() * 5))}],
    tong:0, congViec:t.congViec, anh:[], email:NS[3 + (i % 3)].email, hoTen:NS[3 + (i % 3)].hoTen, gio:'07:' + pad(10 + i * 7), ms:d.getTime() + i, nguoiSua:'', gioSua:'', cu:false}))
    .map(x => (x.tong = x.toDoi.reduce((s, t) => s + t.qs, 0), x));
}
function nhanLucTH(d){
  const maDA = d.maDA || DA1, to = toDoi.filter(t => t.maDA === maDA).map(t => t.tenTo), ngayDS = [];
  for (let n = 45; n >= 0; n--){
    const dd = ngay(-n); if (dd.getDay() === 0) continue;
    const q = to.map((t, i) => [i, Math.max(3, Math.round(toDoi.find(x => x.tenTo === t).quanSo * (0.7 + rnd() * 0.4)))]);
    const tong = q.reduce((s, x) => s + x[1], 0);
    ngayDS.push({n:iso(dd), t:tong, r:to.length, q, k:to.map((t, i) => [toDoi.find(x => x.tenTo === t).viTri, q[i][1], NS[3 + (i % 3)].hoTen, '07:' + pad(10 + i * 5)])});
  }
  return {maDA, ngayBDDA:(DUAN.find(x => x.maDA === maDA) || {}).ngayBD, to, ngay:ngayDS, luc:new Date().toISOString()};
}

/* ---------------- THANH TOÁN CĐT ---------------- */
function thanhToanDS(d){
  const maDA = d.maDA || DA1, gtGoi = maDA === DA1 ? 186000000000 : 98000000000;
  const dot = [[1, 'Tạm ứng hợp đồng', 0.15, -200, 'DA_NHAN'], [2, 'Hoàn thành móng, tầng hầm', 0.1, -120, 'DA_NHAN'], [3, 'Hoàn thành kết cấu đến tầng 4', 0.1, -50, 'DA_NHAN'],
               [4, 'Hoàn thành kết cấu đến tầng 8', 0.1, 6, 'DA_DE_NGHI'], [5, 'Cất nóc', 0.1, 60, 'CHUA_DEN_HAN']];
  const ds = dot.map((x, i) => ({id:'XT-TT' + i, maDA, goi:'Gói thầu chính (mô phỏng)', giaTriGoi:gtGoi, dot:String(x[0]), noiDung:x[1], tyLe:x[2], giaTriKH:Math.round(gtGoi * x[2]),
    ngayKH:iso(ngay(x[3])), giaTriDeNghi:x[4] === 'CHUA_DEN_HAN' ? 0 : Math.round(gtGoi * x[2]), ngayDeNghi:x[4] === 'CHUA_DEN_HAN' ? '' : iso(ngay(x[3] - 10)), hanTT:iso(ngay(x[3] + 20)),
    giaTriNhan:x[4] === 'DA_NHAN' ? Math.round(gtGoi * x[2]) : 0, ngayNhan:x[4] === 'DA_NHAN' ? iso(ngay(x[3] + 15)) : '', trangThai:x[4], ghiChu:'', buocHS:x[4] === 'DA_NHAN' ? 6 : x[4] === 'DA_DE_NGHI' ? 4 : 1,
    nguoiCapNhat:'Lê Thị Chi', thoiGian:new Date().toISOString()}));
  return {maDA, quyen:{xem:true, sua:true, xoa:true}, coSheet:true, ds};
}

/* ---------------- KPI ---------------- */
const TC = {
  CBKT:[['A', 'TIẾN ĐỘ HẠNG MỤC ĐƯỢC GIAO (18%)', 'CBKT-01', 'Hoàn thành đầu việc theo phiếu giao việc', '100% đầu việc do CHP giao hoàn thành đúng hạn', 11],
        ['A', 'TIẾN ĐỘ HẠNG MỤC ĐƯỢC GIAO (18%)', 'CBKT-02', 'Nhật ký và báo cáo khối lượng hằng ngày', 'Cập nhật nhật ký, báo cáo khối lượng hằng ngày', 7],
        ['B', 'QUẢN LÝ CHẤT LƯỢNG – KỸ THUẬT (18%)', 'CBKT-03', 'Lỗi kỹ thuật bị TVGS/CĐT lập biên bản', '≤ 01 lỗi/tháng tại phần việc phụ trách', 11],
        ['B', 'QUẢN LÝ CHẤT LƯỢNG – KỸ THUẬT (18%)', 'CBKT-04', 'Khắc phục lỗi và không tái diễn', '100% lỗi đóng trong ≤ 24 giờ', 7],
        ['C', 'NGHIỆM THU VÀ HỒ SƠ (18%)', 'CBKT-05', 'Thực hiện quy trình nghiệm thu', 'Nghiệm thu lần đầu đạt ≥ 80%', 11],
        ['C', 'NGHIỆM THU VÀ HỒ SƠ (18%)', 'CBKT-06', 'Hồ sơ nghiệm thu, hoàn công', 'Hoàn thành ≤ 05 ngày sau thi công', 7],
        ['D', 'VẬT TƯ & GIÁM SÁT TỔ ĐỘI (13%)', 'CBKT-07', 'Kiểm soát hao hụt vật tư', 'Không vượt định mức được giao', 7],
        ['D', 'VẬT TƯ & GIÁM SÁT TỔ ĐỘI (13%)', 'CBKT-08', 'Giám sát tổ đội, thầu phụ', 'Xác nhận khối lượng trung thực, kịp thời', 6],
        ['E', 'AN TOÀN LAO ĐỘNG (9%)', 'CBKT-09', 'An toàn tại phần việc phụ trách', 'Không phát sinh tai nạn lao động', 9],
        ['F', 'HỌC TẬP VÀ SỐ HÓA (4%)', 'CBKT-10', 'Đào tạo nội bộ và số hóa', 'Tham dự ≥ 02 buổi hướng dẫn/tháng', 4]],
  CHT:[['A', 'TIẾN ĐỘ & SẢN LƯỢNG (30%)', 'CHT-01', 'Sản lượng tháng theo kế hoạch', 'Sản lượng nghiệm thu ≥ 100% kế hoạch', 15],
       ['A', 'TIẾN ĐỘ & SẢN LƯỢNG (30%)', 'CHT-02', 'Mốc tiến độ hợp đồng', 'Không chậm mốc tiến độ được duyệt', 15],
       ['B', 'CHẤT LƯỢNG – AN TOÀN (25%)', 'CHT-03', 'Chất lượng công trình', 'Không khiếu nại chất lượng của CĐT', 13],
       ['B', 'CHẤT LƯỢNG – AN TOÀN (25%)', 'CHT-04', 'An toàn lao động', 'Không tai nạn lao động', 12],
       ['C', 'TÀI CHÍNH – THANH TOÁN (25%)', 'CHT-05', 'Hồ sơ thanh toán CĐT', 'Nộp đúng hạn, không bị trả lại', 13],
       ['C', 'TÀI CHÍNH – THANH TOÁN (25%)', 'CHT-06', 'Chi phí quản lý công trường', '≤ giá trị giao khoán', 12]]
};
const PCT_MAU = [1, 0.95, 0.86, 1, 0.9, 1, 1, 0.83, 1, 1];
function kpiGoi(ns, thang, mode){
  /* mode: 0 chưa chấm · 1 đã tự chấm · 2 chờ duyệt · 3 đã duyệt */
  const vt = TC[ns.vt] ? ns.vt : 'CBKT';
  const ds = [{nhom:'I', tenNhom:'KẾT QUẢ KPI BAN CHỈ HUY (10%)', maTC:vt + '-00', tenTC:'Kết quả KPI Ban Chỉ huy tháng', chiTieu:'Lấy theo % phiếu KPI Ban của dự án', diemMax:10, tuDong:'KPI_BAN', pctGoiY:0.95, pct:0.95, diem:9.5}];
  TC[vt].forEach((r, i) => { const p = PCT_MAU[i % PCT_MAU.length];
    ds.push({nhom:r[0], tenNhom:r[1], maTC:r[2], tenTC:r[3], chiTieu:r[4], diemMax:r[5], tuDong:'', pctGoiY: i === 1 ? 0.86 : null,
      pctTuCham: mode >= 1 ? Math.min(1, p + 0.05) : null, dienGiaiNV: mode >= 1 && p < 1 ? 'Có lý do khách quan, đã báo CHP' : '',
      pct: mode >= 2 ? p : null, diem: mode >= 2 ? r2(p * r[5]) : null, dienGiai: mode >= 2 && p < 1 ? 'Theo số liệu app và biên bản hiện trường' : ''}); });
  ds.push({nhom:'G', tenNhom:'THÁI ĐỘ HÀNH VI (10%)', maTC:vt + '-11', tenTC:'Tuân thủ nội quy, thái độ, trách nhiệm', chiTieu:'Không vi phạm phụ lục A7.15', diemMax:10, tuDong:'VI_PHAM', pct:1, diem:10});
  const tong = mode >= 2 ? r2(ds.reduce((s, t) => s + (t.diem || 0), 0) * (100 / ds.reduce((s, t) => s + t.diemMax, 0))) : null;
  const tt = ['NHAP', 'TU_CHAM', 'CHO_DUYET', 'DA_DUYET'][mode];
  return {phieu:{id:thang + '|' + ns.email, thang, maDA:ns.da, email:ns.email, hoTen:ns.hoTen, viTri:vt, trangThai:tt, tongDiem:tong, ketLuan: mode === 3 ? (tong >= 90 ? 'Hoàn thành tốt nhiệm vụ' : 'Hoàn thành nhiệm vụ') : '',
      heSoH: tong == null ? null : (tong >= 90 ? 1 : tong >= 86 ? 0.95 : 0.9), phanLoai:'', ghiChuChuyenDA:'', tuChamLuc: mode >= 1 ? iso(ngay(-2)) : '',
      nguoiCham: mode >= 2 ? 'chp@vidu.vn' : '', thoiGianCham: mode >= 2 ? iso(ngay(-1)) : '', nguoiDuyet: mode === 3 ? 'cht@vidu.vn' : '', thoiGianDuyet: mode === 3 ? iso(ngay(0)) : '',
      lyDoTra:'', yKienNV:'', diemChuan: mode === 3 ? tong : null, diemVC:null, ghiVC:''},
    vuotChuan:[], tieuChi:ds, viPham:[], quyen:{tuCham:false, cham:true, duyet:true, yKien:false}, nguoiCham:{loai:'CHP'}, cauHinh:{}, kpiBan:{trangThai:'DA_DUYET', ketQua:0.95}};
}
const KPI_TT_MAU = ['DA_DUYET', 'CHO_DUYET', 'TU_CHAM', 'DA_DUYET', 'NHAP', 'DA_DUYET', 'CHO_DUYET', 'DA_DUYET', 'TU_CHAM', 'DA_DUYET', 'DA_DUYET', 'CHO_DUYET', 'DA_DUYET'];
const KPI_DIEM = [96.5, 91, null, 88.5, null, 93, 84, 97, null, 90.5, 86, 92.5, 94];
const modeCua = tt => ({NHAP:0, TU_CHAM:1, CHO_DUYET:2, DA_DUYET:3})[tt];
function kpiDS(che){
  return NS.map((n, i) => ({email:n.email, hoTen:n.hoTen, viTri:n.vt, maDA:n.da, trangThai:KPI_TT_MAU[i], tongDiem:KPI_DIEM[i], tuChamLuc: KPI_TT_MAU[i] === 'NHAP' ? '' : iso(ngay(-2))}))
    .filter(x => che !== 'DUYET' || ['CHO_DUYET', 'DA_DUYET'].includes(x.trangThai));
}
function kpiCuaToi(d){
  const thang = d.thang || THANG_TRUOC;
  const lichSu = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((k, i) => ({thang:lui(k), tongDiem:[86, 88, 87.5, 90, 91, 89, 92.5, 93, 90.5, 94, 95.5][i], trangThai:'DA_DUYET'}));
  const me = {email:EM, hoTen:'Khách xem thử', vt:'CHT', da:DA1};
  return {thang, viTri:'CHT', tenViTri:'Chỉ huy trưởng', lichSu, quyen:{cham:true, duyet:true, viPham:true, tongHop:true, vuotChuan:true}, goi:(() => { const g = kpiGoi(me, thang, 3); g.phieu.tongDiem = 95.5; g.phieu.diemChuan = 95.5; g.phieu.heSoH = 1; g.phieu.ketLuan = 'Hoàn thành tốt nhiệm vụ'; return g; })(),
    dmViPham:[{maVP:'VP-01', nhom:'I. NỘI QUY – KỶ LUẬT', tenVP:'Đi muộn, về sớm từ 03 lần/tháng', mucTru:20}, {maVP:'VP-02', nhom:'I. NỘI QUY – KỶ LUẬT', tenVP:'Không tuân thủ trang phục, PPE', mucTru:20},
      {maVP:'VP-10', nhom:'IV. AN TOÀN – AN NINH', tenVP:'Không xử lý vi phạm an toàn trong phạm vi giám sát', mucTru:50}]};
}
function kpiPhieu(d){
  const i = NS.findIndex(x => x.email === d.email); const n = NS[i] || NS[3];
  return kpiGoi(n, d.thang || THANG_TRUOC, modeCua(KPI_TT_MAU[Math.max(0, i)]));
}
function kpiTongHop(d){
  const ds = kpiDS('').map((x, i) => ({hoTen:x.hoTen, viTri:x.viTri, maDA:x.maDA, diemBan:9.5, diemMucTieu: x.tongDiem == null ? null : r2(x.tongDiem - 19.5), diemThaiDo: x.tongDiem == null ? null : 10,
    tongDiem:x.tongDiem, heSoH: x.tongDiem == null ? null : (x.tongDiem >= 90 ? 1 : x.tongDiem >= 86 ? 0.95 : 0.9), phanLoai:'', trangThai:x.trangThai}));
  const dem = {}; ds.forEach(x => dem[x.trangThai] = (dem[x.trangThai] || 0) + 1);
  const dd = ds.filter(x => x.trangThai === 'DA_DUYET' && x.tongDiem != null);
  return {thang:d.thang, ds, dem, trungBinh: Math.round(dd.reduce((s, x) => s + x.tongDiem, 0) / dd.length * 10) / 10, soVP:1,
    kpiBan:[{maDA:DA1, trangThai:'DA_DUYET', ketQua:0.95, nguoiCham:'cht.ktx@vidu.vn'}, {maDA:DA2, trangThai:'CHO_DUYET', ketQua:0.9, nguoiCham:'cht.nx@vidu.vn'}], quyDoi:[]};
}
function kpiBanPhieu(d){
  const maDA = d.maDA || DA1;
  const TCB = [['F1', 'F', 'TÀI CHÍNH', 0.4, 0.5, 'Sản lượng tháng theo kế hoạch', 'Tỷ lệ % sản lượng hoàn thành', 'TH_KH', 'Tỷ VND', 6.5, 6.2],
               ['F2', 'F', 'TÀI CHÍNH', 0.4, 0.5, 'Nghiệm thu, xuất hóa đơn ≥ 95% sản lượng', 'Tỷ lệ % hồ sơ nghiệm thu', 'TH_KH', 'Tỷ VND', 6.2, 5.9],
               ['C1', 'C', 'KHÁCH HÀNG', 0.2, 0.5, 'Không có khiếu nại của CĐT', 'Số khiếu nại', 'KHONG_VUOT', 'Vụ', 0, 0],
               ['C2', 'C', 'KHÁCH HÀNG', 0.2, 0.5, 'Không chậm tiến độ được giao', 'Tiến độ thực tế / kế hoạch', 'TH_KH', '%', 100, 96],
               ['B1', 'B', 'VẬN HÀNH', 0.3, 0.3, 'Hoàn thành bảng lương Ban trước ngày 21', 'Thời gian hoàn thành', 'HAN_NGAY', 'Ngày', iso(ngay(-10)), iso(ngay(-12))],
               ['B2', 'B', 'VẬN HÀNH', 0.3, 0.4, 'Không tai nạn lao động nghiêm trọng', 'Số vụ', 'KHONG_VUOT', 'Số vụ', 0, 0],
               ['B3', 'B', 'VẬN HÀNH', 0.3, 0.3, 'Đảm bảo chất lượng công trình', 'Số vi phạm chất lượng', 'KHONG_VUOT', 'Vi phạm', 0, 0],
               ['L1', 'L', 'PHÁT TRIỂN', 0.1, 1, 'Số hóa dữ liệu, quản lý bằng phần mềm', 'Nhóm dữ liệu được số hóa', 'TH_KH', '%', 10, 10]];
  const tieuChi = TCB.map(t => { const ht = t[7] === 'HAN_NGAY' ? (t[10] <= t[9] ? 1 : 0) : t[7] === 'KHONG_VUOT' ? (t[10] <= 0 ? 1 : 0) : Math.min(2, r2(t[10] / t[9]));
    return {ma:t[0], nhom:t[1], tenNhom:t[2], trongSoNhom:t[3], trongSo:t[4], ten:t[5], tieuChi:t[6], phuongPhap:t[7], donVi:t[8], nguon:'Mô phỏng', khoaKH:t[7] === 'KHONG_VUOT', keHoach:t[9], thucHien:t[10], hoanThanh:ht, dienGiai:''}; });
  const nhom = {}; tieuChi.forEach(t => { nhom[t.nhom] = nhom[t.nhom] || {nhom:t.nhom, ts:t.trongSoNhom, pctNhom:0}; nhom[t.nhom].pctNhom += t.hoanThanh * t.trongSo; });
  const nh = Object.values(nhom).map(n => ({nhom:n.nhom, pctNhom:r2(n.pctNhom)}));
  const kq = r2(Object.values(nhom).reduce((s, n) => s + n.pctNhom * n.ts, 0));
  const tt = maDA === DA1 ? 'DA_DUYET' : 'CHO_DUYET';
  return {thang:d.thang, maDA, dsDA:[DA1, DA2], quyenCham:true, goi:{phieu:{id:'XT-KB', thang:d.thang, maDA, trangThai:tt, ketQua:kq, nguoiCham:'cht@vidu.vn', thoiGianCham:iso(ngay(-2)), nguoiDuyet: tt === 'DA_DUYET' ? 'quantri@vidu.vn' : '', thoiGianDuyet:'', lyDoTra:'', ghiChu:''},
    tieuChi, tinh:{ketQua:kq, nhom:nh}, quyen:{cham:false, duyet: tt === 'CHO_DUYET', tuDuyetBiCam:false}}};
}
function kpiViPhamDS(d){
  return {thang:d.thang, ds:[{id:'XT-VP1', email:'kt2.ktx@vidu.vn', hoTen:'Hoàng Văn Em', ngay:iso(ngay(-20)), maVP:'VP-02', tenVP:'Không tuân thủ trang phục, PPE', mucTru:20, ghiChu:'Không đeo dây an toàn khi lên sàn tầng 6', minhChung:'BB số 03/ATLĐ', nguoiGhi:'Trần Văn Bình'}]};
}
const VC_CFG = {bat:true, soMT:2, dat:5, vuot:10, tran:20, dieuKien:90, vpNang:80, nguoi:5, hanDK:5, tranNguoi:0.3};
const VC_DM = {CHT:[
  {ma:'CHT-V01', ten:'Sản lượng tháng vượt kế hoạch', dat:'Sản lượng nghiệm thu nội bộ ≥ 105% kế hoạch tháng', vuot:'≥ 110% kế hoạch tháng', bangChung:'Báo cáo sản lượng QS', lienKet:'KPI Ban F1'},
  {ma:'CHT-V03', ten:'Hoàn thành mốc tiến độ hợp đồng sớm', dat:'Mốc tiến độ hoàn thành sớm ≥ 7 ngày', vuot:'Sớm ≥ 14 ngày', bangChung:'Biên bản nghiệm thu mốc có CĐT ký', lienKet:'KPI Ban'}],
 CBKT:[
  {ma:'CBKT-V01', ten:'Phần việc phụ trách vượt tiến độ', dat:'Hoàn thành sớm ≥ 2 ngày so với phiếu giao việc', vuot:'Sớm ≥ 5 ngày', bangChung:'Phiếu giao việc có CHP xác nhận', lienKet:'CBKT-01'},
  {ma:'CBKT-V02', ten:'Không lỗi, nghiệm thu đạt lần đầu', dat:'0 lỗi TVGS/CĐT lập biên bản, 100% đạt lần đầu (≥ 8 đợt)', vuot:'Như mức Đạt, ≥ 15 đợt', bangChung:'Sổ NCR; danh sách phiếu nghiệm thu', lienKet:'CBKT-03, -05'}]};
function kpiVcXem(d){
  const g = (id, ns, ma, ten, ck, tt, kq, diem, bc) => ({id, thang:d.thang, maDA:ns.da, email:ns.email, hoTen:ns.hoTen, viTri:ns.vt, ma, ten, camKet:ck, idNhom:'', chuNhom:ns.email, thanhVien:ns.email, trangThai:tt, lyDo:'', bangChung:bc || '', ketQua:kq || '', diem});
  const canXuLy = [g('XT-V1', NS[3], 'CBKT-V01', 'Phần việc phụ trách vượt tiến độ', 'Xong cốt thép cột vách tầng 9 Block A trước kế hoạch 3 ngày', 'DA_DUYET_DK', '', null, 'BB nghiệm thu nội bộ cốt thép T9'),
                   g('XT-V2', NS[4], 'CBKT-V02', 'Không lỗi, nghiệm thu đạt lần đầu', '0 lỗi TVGS, 100% đạt lần đầu ≥ 10 đợt Block B', 'CHO_DUYET_DK', '', null, ''),
                   g('XT-V3', NS[10], 'CBKT-V01', 'Phần việc phụ trách vượt tiến độ', 'Lắp xong xà gồ trục 1–6 trước 5 ngày', 'DA_DUYET_DK', 'VUOT', 10, 'Biên bản nghiệm thu xà gồ')];
  return {thang:d.thang, cfg:VC_CFG, moDK:true, viTri:'CHT', danhMuc:VC_DM.CHT, cua:[g('XT-V0', {email:EM, hoTen:'Khách xem thử', vt:'CHT', da:DA1}, 'CHT-V01', 'Sản lượng tháng vượt kế hoạch', 'Sản lượng nghiệm thu ≥ 6,8 tỷ (KH 6,5 tỷ)', 'DA_DUYET_DK', '', null, '')],
    canXuLy, dongNghiep:NS.slice(1, 6).map(n => ({email:n.email, hoTen:n.hoTen})), laQT:true,
    tongHop:[{maDA:DA1, soApKPI:8, soDangKy:4, soDat:2, tyLeDat:25, canhBao:false, choDuyet:1, ds:canXuLy.slice(0, 2)}, {maDA:DA2, soApKPI:5, soDangKy:2, soDat:1, tyLeDat:20, canhBao:false, choDuyet:0, ds:canXuLy.slice(2)}]};
}

/* ---------------- LƯƠNG (MÔ PHỎNG) ---------------- */
const P3P = {LTT:5310000, NQD:26, TL_CD:0.75, TL_BD:0.25, KPI_SAN:0.7, HS_SAN:0.5, KPI_DAT:0.9, KPI_100:1, KPI_TRAN:1.2, HS_TRAN:2, OT_TH:1.5, OT_CN:2, OT_LE:3, OT_HT:2, BH_NLD:0.105,
  DOAN_PHI:0.005, HS_KHONG_BH:1.15, TN_M1:2, TN_P1:0.02, TN_M2:5, TN_P2:0.04, TN_M3:10, TN_P3:0.06, TN_KPI:0.8, GB_5:0.5, GB_10:1, TN_BH:1, K:1, NC_CHUAN_QUY:78, CHE_DO:'SONG_SONG'};
function phieuLuong(thang, maDA, k){
  const lcb = 6800000, pc = 1060000, mdk = 23000000, nc = 24 + (k % 2), nqd = 26;
  const p1 = Math.round((lcb + pc) * nc / nqd), p2 = Math.round(Math.max(0, mdk * 0.75 * nc / nqd - p1)), tn = Math.round(mdk * 0.04 * nc / nqd);
  const kpi = [0.93, 0.955, 0.94, 0.965][k % 4], hs = 1, p3 = Math.round(mdk * 0.25 * hs * nc / nqd), le = k === 2 ? Math.round((lcb + pc) * 2 / nqd) : 0;
  const tong = p1 + p2 + tn + p3 + le, bh = Math.round((lcb + pc + tn) * 0.105);
  return {thang, maDA, hoTen:'Khách xem thử', chucDanh:'CHT', hsBH:1.28, lcb, pc, ncTT:nc, ncQD:nqd, ngayLe:le ? 2 : 0, tienLe:le, tnDK:mdk, tienNC:p1, tienHQ:p2 + p3,
    gioLT:0, tienLT:0, bsQuy:0, bsKhac:0, truBH:bh, thucLinh:tong - bh, doanPhi:Math.round((lcb + pc) * 0.005), tongTN:tong, cheDo:'CHINH_THUC',
    p1, p2, p3, hsKPI:hs, kpiPct:Math.round(kpi * 1000) / 10, tienTN:tn, ptTN:0.04, thangTN:78, tienLe3p:le, mdk3p:mdk, lcb3p:lcb, heSoH:1, phanLoai:'Hoàn thành tốt', khac:[]};
}
function luongXem(d){
  const nam = d.nam || String(HOM.getFullYear()), ds = [4, 3, 2, 1].map(k => phieuLuong(lui(k), DA1, k)).filter(x => x.thang.indexOf(nam) === 0);
  const dong = [{maDA:DA1, chucDanh:'CHT', apKpi:'TRUE', hs:1.28, lcb:6800000, pc:1060000, mdkCu:23000000, mdk:23700000, thangTN:79, ptTN:0.04, ntt:25, nqd:26, le:0, gb:0, bs:0}];
  return {ve:'XEMTHU', email:EM, hoTen:'Khách xem thử', nam, namCo:[nam], ds, qt:true,
    quyen:{qt:true, bang:true, nap:false, duAnXem:[DA1, DA2], duAnNhap:[], duAnDuyet:[DA1, DA2]},
    nguoiCo:NS.map(n => ({email:n.email, hoTen:n.hoTen})), chuaGhep:[], nhanSu:[], daNap:[[lui(1) + '|' + DA1, 8], [lui(1) + '|' + DA2, 5]],
    duKien:{thang:THANG_NAY, nguon:THANG_NAY, bat:true, dong, p:P3P, viTri:'CHT', vc:VC_CFG, danhMuc:VC_DM.CHT},
    tamUng:{dong:[], mo:false, capNhat:'', cu:false}, yKien:0};
}
function luongBang(d){
  const thang = d.thang || lui(1), maDA = d.maDA || DA1;
  const ds = NS.filter(n => n.da === maDA).map((n, i) => {
    const mdk = {CHT:23000000, CHP_HT:19500000, QS:15500000, CBKT:13500000, THU_KHO:10500000, KE_TOAN:12000000, SHOP:13000000}[n.vt] || 12000000;
    const kpi = [95.5, 91, 88.5, 93, 84, 97, 90.5, 86][i % 8] / 100, nc = 24 + (i % 3), nqd = 26, lcb = 5310000 * (1.2 + (i % 4) * 0.1), pc = 600000;
    const p1 = Math.round((lcb + pc) * nc / nqd), p2 = Math.round(Math.max(0, mdk * 0.75 * nc / nqd - p1));
    const hs = kpi < 0.7 ? 0 : kpi < 0.9 ? 0.5 + (kpi - 0.7) / 0.2 * 0.5 : kpi <= 1 ? 1 : Math.min(2, 1 + (kpi - 1) / 0.2);
    const p3 = Math.round(mdk * 0.25 * hs * nc / nqd), tn = Math.round(mdk * 0.02 * nc / nqd), bh = Math.round((lcb + pc + tn) * 0.105), tong = p1 + p2 + p3 + tn, tl = tong - bh;
    return {id:thang + '|' + maDA + '|' + i, thang, ma_da:maDA, email:n.email, ho_ten:n.hoTen, chuc_danh:n.vt, nhom:'', stt:i + 1, hs_bhxh:1.2 + (i % 4) * 0.1, lcb:Math.round(lcb), pc, nc_tt:nc, nc_qd:nqd,
      tien_nc:p1, ngay_le:0, tien_le:0, tn_du_kien:mdk, hs_ht:1, hs_hq:1, nc_hq:nc, tien_hq:p2 + p3, tien_lt:0, tru_bhxh:bh, thuc_linh:tl, thuc_linh_hien_tai:tl - Math.round((hs - 1) * mdk * 0.1),
      doan_phi:Math.round((lcb + pc) * 0.005), tong_tn:tong, du_an_chinh:maDA, ap_kpi:'TRUE', he_so_H:1, kpi_pct:Math.round(kpi * 1000) / 10, phan_loai:'', chenh_lech:Math.round((hs - 1) * mdk * 0.1),
      che_do:'SONG_SONG', trang_thai_luong:'CHO_DUYET', ngay_vao_cong_ty:iso(ngay(-900 - i * 200)), hs_thuong_kpi:Math.round(hs * 10000) / 10000, kpi6_pct:Math.round(kpi * 1000) / 10, vi_pham_nang:'FALSE',
      thang_tham_nien:30 + i * 6, pt_tham_nien:0.02, tien_tham_nien:tn, lcb_3p:Math.round(lcb), p1_thuc_tra:p1, p2_nang_luc:p2, p3_kpi:p3, mdk_3p:mdk, tong_tn_3p:tong, tru_bh_3p:bh, thuc_linh_3p:tl, tien_le_3p:0, doan_phi_3p:Math.round((lcb + pc) * 0.005)};
  });
  return {ds, thang, maDAs:[DA1, DA2], cauHinh:{cheDo:'SONG_SONG', ncQD:26, K:1, p:P3P}, quyen:{qt:true, nhap:[], duyet:[]}};
}
function thuongQuyBang(d){
  const maDA = d.maDA || DA1, quy = d.quy || (HOM.getFullYear() + '-Q' + Math.max(1, Math.ceil(HOM.getMonth() / 3)));
  const ds = NS.filter(n => n.da === maDA && n.vt !== 'KE_TOAN').map((n, i) => { const hs = {CHT:3, CHP_HT:2}[n.vt] || 1, kpi = [0.95, 0.91, 0.885, 0.93, 0.84, 0.97][i % 6];
    return {email:n.email, hoTen:n.hoTen, chucDanh:n.vt, viTri:n.vt, hs, kpi, soThangKPI:3, nc:74 + (i % 4), mat:false, lyDoMat:'', diem:0, tien:0}; });
  const quyT = 80000000; ds.forEach(x => x.diem = r2(x.hs * x.kpi * x.nc / 78)); const tong = ds.reduce((s, x) => s + x.diem, 0); ds.forEach(x => x.tien = Math.round(quyT * x.diem / tong / 1000) * 1000);
  return {quy, maDA, thangs:[1, 2, 3].map(k => lui(k)), quyThuong:quyT, tongDiem:r2(tong), trangThai:'CHO_DUYET', nguoiDeXuat:'cht@vidu.vn', nguoiDuyet:'', ds, ngoai:[], ncChuan:78, kpiSan:0.7, quyen:{deXuat:false, duyet:false}};
}
function xetTangBang(d){
  const maDA = d.maDA || DA1;
  const ds = NS.filter(n => n.da === maDA).map((n, i) => { const cu = {CHT:23000000, CHP_HT:19500000, QS:15500000, CBKT:13500000}[n.vt] || 11000000, kpi6 = [0.928, 0.91, 0.79, 0.92, 0.86, 0.95][i % 6], pt = kpi6 >= 0.9 ? 0.03 : 0;
    return {email:n.email, hoTen:n.hoTen, viTri:n.vt, mdkCu:cu, giua:Math.round(cu * 1.04), viTriKhung:r2(0.9 + (i % 3) * 0.04), kpi6, soThang:6, pt, mdkMoi:Math.round(cu * (1 + pt)), ghiChu:'', trangThai:''}; });
  return {ky:d.ky || (HOM.getFullYear() + 1) + '-K1', maDA, thangs:[6, 5, 4, 3, 2, 1].map(k => lui(k)), hieuLuc:(HOM.getFullYear() + 1) + '-01', ds, quyen:{deXuat:false, duyet:false}};
}
function luongTamUngDS(){
  return {ds:[{maDA:DA1, hoTen:'Phạm Văn Dũng', conNo:5000000, choDuyet:0, khoanCu:1, soNgay:24, capNhat:iso(ngay(-1)), coEmail:true, chiTiet:[{ngay:iso(ngay(-24)), loai:'Tạm ứng lương', soTien:5000000, noiDung:'Tạm ứng giữa tháng (mô phỏng)', trangThai:'DA_DUYET'}]},
              {maDA:DA2, hoTen:'Lý Thị Nga', conNo:3000000, choDuyet:2000000, khoanCu:0, soNgay:8, capNhat:iso(ngay(-1)), coEmail:true, chiTiet:[{ngay:iso(ngay(-8)), loai:'Tạm ứng lương', soTien:3000000, noiDung:'Tạm ứng (mô phỏng)', trangThai:'DA_DUYET'}]}],
    capNhat:iso(ngay(-1)), cu:false};
}

/* ---------------- CHAT MÔ PHỎNG ---------------- */
const UID = 'xt-khach';
const TV = NS.map((n, i) => ({uid:'xt-u' + i, ten:n.hoTen, vt:n.vaiTro, email:n.email, duAn:[n.da]})).concat([{uid:UID, ten:'Khách xem thử', vt:'ADMIN', email:EM, duAn:['TAT_CA']}]);
const tin = (id, u, text, phut) => ({id, uid:TV[u] ? TV[u].uid : UID, ten:TV[u] ? TV[u].ten : 'Khách xem thử', vt:TV[u] ? TV[u].vt : 'ADMIN', text, loai:'text', ts:Date.now() - phut * 60000});
window.demoChat = function(){
  return {uid:UID, gv:true, qt:true, dsDA:[DA1, DA2], tv:TV,
    tinDA:{CHUNG:[tin('c1', 0, 'Chào cả Ban, tuần này ưu tiên sàn tầng 8 và mái nhà xưởng nhé.', 300), tin('c2', 8, 'Nhà xưởng đã lên 2 tổ lợp mái từ sáng nay.', 240), tin('c3', 1, 'Đã nhận. Tối nay chốt kế hoạch bê tông.', 200)],
           [DA1]:[tin('a1', 3, 'Cốt thép dầm sàn tầng 8 trục 1–4 xong, mời TVGS nghiệm thu 14h.', 180), tin('a2', 1, '@Lê Thị Chi tính lại khối lượng bê tông sàn tầng 8 giúp anh.', 150), tin('a3', 2, 'Em gửi: 286 m³, đã trừ lỗ mở kỹ thuật.', 120), tin('a4', 0, 'OK, đổ 7h sáng mai. Mọi người xác nhận trên app.', 60)],
           [DA2]:[tin('b1', 10, 'Bu lông neo trục 9 lệch 8 mm, đã khoan cấy lại theo chỉ dẫn TK.', 400), tin('b2', 9, 'Chụp ảnh gửi lên nhóm, chiều nay mời TVGS kiểm tra.', 380)]},
    viec:[{id:'v1', da:DA1, tieuDe:'Hoàn thiện hồ sơ nghiệm thu cốt thép tầng 8', moTa:'Gửi TVGS trước 16h', giao:{uid:'xt-u0', ten:'Nguyễn Văn An'}, nhan:{uid:'xt-u3', ten:'Phạm Văn Dũng'}, han:iso(ngay(0)), tt:'DANG_LAM', ts:Date.now() - 86400000},
          {id:'v2', da:DA2, tieuDe:'Kiểm tra độ dốc mái trục 1–6', moTa:'', giao:{uid:'xt-u8', ten:'Ngô Văn Khánh'}, nhan:{uid:'xt-u10', ten:'Trịnh Văn Minh'}, han:iso(ngay(2)), tt:'MOI', ts:Date.now() - 3600000}]};
};

/* ---------------- TRỢ LÝ AI / BÁO CÁO ---------------- */
function hoiAI(d){
  return {traLoi:'Đây là tài khoản xem thử nên Trợ lý BCH trả lời mẫu, không gọi AI thật.\n\nTrên tài khoản thật, Trợ lý đọc số liệu dự án (tiến độ, khối lượng, bê tông, nhân lực) và bản vẽ đã nạp để trả lời, ví dụ:\n- Việc nào đang chậm so với kế hoạch tuần này?\n- Khối lượng bê tông sàn tầng 8 còn lại bao nhiêu?\n- Tóm tắt vướng mắc hiện trường 3 ngày qua.',
    model:'mô phỏng', nguon:[], banVe:[]};
}
function taoBaoCao(d){
  const dm = danhmuc.filter(x => x.maDA === (d.maDA || DA1));
  const L = ['BÁO CÁO ' + (d.ky === 'TUAN' ? 'TUẦN' : d.ky === 'THANG' ? 'THÁNG' : 'NGÀY') + ' — ' + ((DUAN.find(x => x.maDA === (d.maDA || DA1)) || {}).tenDA || ''), '(Số liệu mô phỏng — tài khoản xem thử)', '',
    '1. Tình trạng chung: ' + dm.filter(x => x.tinhTrang === 'DANG_THI_CONG').length + ' việc đang thi công, ' + dm.filter(x => x.tinhTrang === 'CHAM').length + ' việc chậm.', '2. Việc chậm / có nguy cơ chậm:'];
  dm.filter(x => x.tinhTrang === 'CHAM' || (x.quanTrong && x.tinhTrang !== 'HOAN_THANH')).forEach(x => L.push('   - ' + x.tenViec + ' (' + x.phanKhu + ' ' + x.zone + ') — hạn ' + x.ngayKT));
  L.push('3. Nhân lực: bình quân 92 người/ngày.', '4. Kiến nghị: bổ sung 1 tổ cốp pha cho sàn tầng 8.');
  return {text:L.join('\n')};
}

/* ---------------- ĐIỀU PHỐI ---------------- */
const DOC = {login:bootstrap, bootstrap, taiKhu:d => ({items:danhmuc.filter(x => x.maDA === d.maDA && x.phanKhu === d.phanKhu), luyke, tongKhu:danhmuc.filter(x => x.maDA === d.maDA && x.phanKhu === d.phanKhu).length}),
  nhanLucTH, baoCaoSangDS:d => ({ngay:iso(HOM), quyenSua:false, ds:bcsNgay(d.maDA || DA1, HOM)}), thanhToanDS,
  kpiCuaToi, kpiDanhSach:d => ({thang:d.thang, ds:kpiDS(d.cheDo)}), kpiPhieu, kpiTongHop, kpiBanPhieu, kpiViPhamDS, kpiVcXem,
  luongXem, luongBang, thuongQuyBang, xetTangBang, luongTamUngDS, luongYKienXem:d => ({hop:[], choTraLoi:0, chu:d.chu || EM, hoTen:'Khách xem thử', ds:[]}),
  hoiAI, taoBaoCao, chatVao:() => { throw new Error('Chat mô phỏng'); }};
const DUOC_PHEP = {ack:true};     // xác nhận đã đọc thông báo: chỉ đổi trên máy
window.demoApi = async function(action, data){
  await new Promise(r => setTimeout(r, 180));
  data = data || {};
  if (action === 'ack'){ const n = (typeof S !== 'undefined' && S.notis || []).find(x => x.id === data.id); if (n) n.daXacNhan = new Date().toISOString(); return {}; }
  if (DOC[action]) return clone(DOC[action](data));
  throw new Error(XT_MSG);
};
window.XT_MSG = XT_MSG;
})();
