export function getCurrentVietnamTime() {
  const now = new Date();
  const vnTime = new Date(now.toLocaleString("en-US", {
    timeZone: "Asia/Bangkok"
  }));
  return vnTime;
}

/**
 * Format Date object thành string MySQL: YYYY-MM-DD HH:mm:ss
 */
export function formatDateTimeForMySQL(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

/**
 * Parse time string "HH:mm" và tạo datetime cho hôm nay/ngày mai
 */
export function parseTimeToVietnamDateTime(timeStr) {
  const [hoursStr, minutesStr] = timeStr.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid time format. Use HH:mm (e.g., 19:30)');
  }

  const nowVN = getCurrentVietnamTime();
  
  // Tạo datetime với giờ được chỉ định
  let targetTime = new Date(
    nowVN.getFullYear(),
    nowVN.getMonth(),
    nowVN.getDate(),
    hours,
    minutes,
    0,
    0
  );

  // Nếu giờ đó đã qua thì chuyển sang ngày mai
  if (targetTime <= nowVN) {
    targetTime.setDate(targetTime.getDate() + 1);
  }

  return targetTime;
}