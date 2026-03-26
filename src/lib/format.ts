export const formatKrw = (value: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0
  }).format(value);

export const formatNumber = (value: number, maximumFractionDigits = 2) =>
  new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits
  }).format(value);

export const formatDateTime = (isoString: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(isoString));
