import type { Province, DisasterType, DisasterGuide, Shelter, EmergencyContact, Alert } from "@/types";

export const sampleProvinces: Province[] = [
  {
    id: "minh-hoa",
    name: "Thành phố Minh Hòa",
    slug: "minh-hoa",
    region: "Miền Trung",
    defaultDisasterCode: "flood",
  },
  {
    id: "an-phuc",
    name: "Tỉnh An Phúc",
    slug: "an-phuc",
    region: "Đông Nam Bộ",
    defaultDisasterCode: "storm",
  },
];

export const sampleDisasterTypes: DisasterType[] = [
  { code: "flood", name: "Lũ lụt", icon: "🌊" },
  { code: "storm", name: "Bão/Áp thấp", icon: "🌪️" },
  { code: "quake", name: "Động đất", icon: "🪨" },
];

const sampleChecklist = [
  { id: "c1", text: "Chuẩn bị túi sơ cứu và thuốc thiết yếu", order: 1 },
  { id: "c2", text: "Sạc đầy pin điện thoại, dự phòng", order: 2 },
  { id: "c3", text: "Dự trữ nước uống và thực phẩm khô 3 ngày", order: 3 },
];

const sampleTipsDuring = [
  { id: "d1", title: "Khi ở trong nhà", bullets: ["Rút thiết bị điện khỏi ổ cắm", "Theo dõi cảnh báo từ chính quyền"] },
  { id: "d2", title: "Khi phải di chuyển", bullets: ["Không đi qua vùng ngập sâu", "Mang theo giấy tờ, thuốc men"] },
];

const sampleTipsAfter = [
  { id: "a1", title: "Sau thiên tai", bullets: ["Kiểm tra an toàn nguồn điện", "Khử trùng nước sinh hoạt trước khi dùng"] },
];

export const sampleGuide: DisasterGuide = {
  provinceId: sampleProvinces[0].id,
  disasterCode: "flood",
  before: sampleChecklist,
  during: sampleTipsDuring,
  after: sampleTipsAfter,
};

export const sampleShelters: Shelter[] = [
  {
    id: "s1",
    name: "Trường THCS Bình An",
    address: "123 Đường Sông Trăng, Quận 5",
    lat: 16.047,
    lng: 108.206,
    phone: "0236 111 222",
    hours: "24/7 trong mùa mưa bão",
    note: "Ưu tiên hộ gia đình, có khu vực riêng cho trẻ nhỏ",
  },
  {
    id: "s2",
    name: "Nhà văn hóa Hòa Bình",
    address: "45 Lê Lợi, TP Minh Hòa",
    lat: 16.055,
    lng: 108.22,
    phone: "0236 333 444",
    hours: "06:00 - 23:00",
    note: "Có máy phát điện dự phòng",
  },
];

export const sampleContacts: EmergencyContact[] = [
  { id: "ec1", name: "Cứu hộ - Cứu nạn", phone: "112", category: "Cứu hộ", note: "24/7" },
  { id: "ec2", name: "Công an", phone: "113", category: "Công an", note: "Khẩn cấp" },
  { id: "ec3", name: "Y tế", phone: "115", category: "Y tế" },
  { id: "ec4", name: "Điện lực", phone: "19001909", category: "Điện lực", note: "Sự cố điện" },
];

export const sampleAlerts: Alert[] = [
  {
    id: "al1",
    provinceId: sampleProvinces[0].id,
    title: "Cảnh báo mưa lớn và ngập lụt",
    content: "Di chuyển khỏi vùng trũng, chuẩn bị sơ tán nếu có yêu cầu.",
    level: "warning",
    scope: "Toàn thành phố Minh Hòa",
    createdAt: new Date().toISOString(),
  },
];
