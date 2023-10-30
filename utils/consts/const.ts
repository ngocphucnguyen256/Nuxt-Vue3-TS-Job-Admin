export const DEFAULT_ITEM_PER_PAGE = 5;
export const MAX_PAGE_VISIBLE = 5;
// 86400000 Milliseconds = 1 day
export const TOKEN_EXPIRED_TIME = 86400000;

export const code: any = {
  SUCCESS: "SUCCESS",
  ERROR_UNAUTHORIZED: "ERROR_UNAUTHORIZED",
};

const projectStatusList: any = {
  receive: { jp: "受注", vn: "Nhận đơn hàng", value: 1 },
  complete_naming: {
    jp: "ネームアップ完了",
    vn: "Hoàn thành đặt tên",
    value: 2,
  },
  unconfirmed_business: {
    jp: "営業未確認",
    vn: "Chưa xác nhận kinh doanh",
    value: 3,
  },
  confirmed_business: {
    jp: "営業確認済み",
    vn: "Đã xác nhận kinh doanh",
    value: 4,
  },
  payment_has_been_requested: {
    jp: "請求済み",
    vn: "Đã yêu cầu thanh toán",
    value: 5,
  },
  paid: { jp: "入金済み", vn: "Đã thanh toán", value: 6 },
  failure: { jp: "失注", vn: "Thất bại", value: 7 },
  undefined: { jp: "未確定", vn: "Chưa xác định", value: 8 },
  other: { jp: "その他", vn: "Khác", value: 9 },
};

export const genderList: any = [
  { title: "男性", value: 0 },
  { title: "女性", value: 1 },
];

export const mainContactItems: any = [
  { title: "Email", value: 1 },
  { title: "Line", value: 2 },
];

export const SALARY_TYPE = {
  DAY: {
    label: "日給",
    value: 1,
  },
  HOUR: {
    label: "時給",
    value: 2,
  },
};

export const salaryTypeItems = Object.values(SALARY_TYPE).map((type) => ({
  title: type.label,
  value: type.value,
}));

export const projectStatusListArray = Object.keys(projectStatusList).map(
  (key) => projectStatusList[key],
);

export const projectStatusItems = projectStatusListArray.map((item) => {
  return {
    title: item.jp,
    value: item.value,
  };
});

export const staffStatusList = [
  { title: "エントリー", value: 1 }, // Đăng ký/Entry
  { title: "口座未登録", value: 2 }, // Chưa đăng ký tài khoản bank
  { title: "事前情報入力済み", value: 3 }, // Đã nhập thông tin trước
  { title: "起床", value: 4 }, // Thức dậy
  { title: "出発", value: 5 }, // Xuất phát
  { title: "作業完了", value: 6 }, // Hoàn thành công việc
  { title: "営業確認", value: 7 }, // Xác nhận kinh doanh
  { title: "給料支払い済み", value: 8 }, // Đã thanh toán lương
  { title: "欠勤", value: 9 }, // Vắng mặt
  { title: "その他", value: 10 }, // Khác
];
export const projectTypeList: any = [
  { title: "イベント", value: 1 }, // event
  { title: "サンプリング", value: 2 }, // sampling
  { title: "軽作業", value: 3 }, // easy work
  { title: "搬入出", value: 4 }, // loading and unloading
  { title: "ポスティング", value: 5 }, // posting
  { title: "その他", value: 6 }, // others
];

export const clientStatusList: any = [
  { title: "使用中止", value: 0 },
  { title: "使用中", value: 1 },
];

export const clientTypeList: any = [
  { title: "SC", value: "1" },
  { title: "EC", value: "2" },
  { title: "NC", value: "3" },
];

export const MESSAGE: any = {
  create: {
    success: "作成に成功しました",
    failed: "作成に失敗しました",
  },
  update: {
    success: "更新に成功しました",
    failed: "更新に失敗しました",
  },
  delete: {
    success: "削除に成功しました",
    failed: "削除に失敗しました",
  },
  login: {
    success: "ログインに成功しました",
    failed: "ログインに失敗しました",
  },
  logout: {
    success: "ログアウトに成功しました",
    failed: "ログアウトに失敗しました",
  },
  somethingWentWrong: "問題が発生しました。しばらくしてからご確認ください。",
};

export const levelList: any = [
  { title: "AD", value: "1" },
  { title: "D", value: "2" },
  { title: "MC", value: "3" },
  { title: "NS", value: "4" },
  { title: "ST", value: "5" },
  { title: "SV", value: "6" },
];

export const entryStatusList: any = {
  waiting: { jp: "エントリー中", vn: "Đang chờ", value: 1 },
  accepted: { jp: "参加に承認済み", vn: "Chấp nhận", value: 2 },
  working: { jp: "作業中", vn: "Đang làm việc", value: 3 },
  absent: { jp: "欠勤", vn: "Vắng mặt", value: 4 },
  completed: { jp: "作業完了", vn: "Hoàn thành", value: 5 },
  paid: { jp: "給料支払い済み", vn: "Đã thanh toán", value: 6 },
};

export const entryStatusListArray = Object.keys(entryStatusList).map(
  (key) => entryStatusList[key],
);

export const entryStatusItems = entryStatusListArray.map((item) => {
  return {
    title: item.jp,
    value: item.value,
  };
});
