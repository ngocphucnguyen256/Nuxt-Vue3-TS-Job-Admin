export const field = {
  required: [
    function required(v: string) {
      return !!v || "入力してください";
    },
  ],
  requiredWithName(name: string, v: string | number | undefined) {
    return [!!v || `${name}を入力してください`];
  },
  radioButtons: [(v: string) => v != null || "入力してください"],
  selectWithName(name: string, v: string | number | undefined) {
    return [
      (v != null && v !== "" && v !== undefined) || `${name}を選択してください`,
    ];
  },
  number: [(v: string) => !isNaN(Number(v)) || "数字で入力してください"],
  arrayNumber: [
    (v: string[]) =>
      v.every((item) => !isNaN(Number(item))) || "選択してください",
  ],
  email: [
    (v: string) => {
      if (v.length === 0) return true;
      return (
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "メールアドレスを入力してください"
      );
    },
  ],
  max5: [(v: string) => parseInt(v) <= 5 || "<5"],
  jpTextOnly: [
    (v: string) =>
      /^[ぁ-んァ-ン一-龯]*$/.test(v) || "日本語のテキストを入力してください",
  ],
  string: [
    (v: string) => typeof v === "string" || "テキストで入力してください",
  ],
  min(num: number, v: string) {
    return [num <= parseInt(v) || `最小で${num}文字で入力してください`];
  },
  max(num: number, v: string) {
    return [parseInt(v) <= num || `最大で${num}文字で入力してください`];
  },
  password: [(v: string) => !!v || "パスワードを入力してください"],
  confirmPassword(password: string | undefined, v: string | undefined) {
    return [password === v || "再度パスワードを入力してください"];
  },
  largerThan(num: number | undefined, v: string | number | undefined) {
    if (typeof v === "string") v = parseInt(v);
    if (v == null) v = 0;
    if (num === undefined) return [false];
    return [num < v || "選択してください"];
  },
  smallerThan(num: number | undefined, v: string | number | undefined) {
    if (typeof v === "string") v = parseInt(v);
    if (v == null) v = 0;
    if (num === undefined) return [false];
    return [num > v || "選択してください"];
  },
  phoneNumber(v: string, maxDigit = 10) {
    let onlyNumberString = "";
    if (!v) {
      return [true];
    }
    const isInputHaveInvalidChar = v.match(/[^0-9-]/g);
    if (isInputHaveInvalidChar) {
      return ["半角数字で入力してください"];
    }
    if (v) onlyNumberString = v.replace(/[^0-9]/g, "");
    return [
      onlyNumberString.length <= maxDigit ||
        `${maxDigit}桁以内で入力してください`,
    ];
  },
};
