import { genderList } from "~/utils/consts/const";
import { SalaryType, clientDetailType } from "~/types/payload-type";

export function convertDateToString(date: Date, divider = "/"): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${year}${divider}${month < 10 ? `0${month}` : month}${divider}${
    day < 10 ? `0${day}` : day
  }`;
}

export function convertDateToParams(date: string | Date) {
  return typeof date === "string" ? date : convertDateToString(date, "-");
}

export function handleConvertGender(value: number) {
  return genderList.find((item: any) => item.value === value)?.title;
}

export function convertWageArrayToArrayValue(wageArray: SalaryType[]) {
  return wageArray.map((item) => item.wage);
}

export function getDaysBetweenDates(startDate: Date, endDate: Date) {
  const days = [];
  const currentDate = new Date(startDate);

  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate <= endDate) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
}

export function handleReturnErrorMessage(res: any, defaultMessage = "") {
  const messageList = res?.error?.messages?.system_mess || [];
  return messageList.join(",") ?? defaultMessage;
}

export function convertPhoneStringToNumber(value: string) {
  // example +1.111.111.1111 to only number: 1111111111
  return value.replace(/[^0-9]/g, "");
}

export function isInViewport(element: any) {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export function convertAddressToString(clientDetail: clientDetailType) {
  return `${clientDetail.street_name} ${
    clientDetail.district &&
    clientDetail.street_name &&
    ", " + clientDetail.district
  } ${clientDetail.city && ", " + clientDetail.city} ${clientDetail.zip_code}`;
}
