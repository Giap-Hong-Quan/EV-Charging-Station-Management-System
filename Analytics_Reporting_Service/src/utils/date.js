export function parseRange({ from, to }) {
  const start = from ? new Date(from) : new Date(Date.now() - 30 * 864e5);   // nếu có from thì chọn from hông lấy 30 ngày 
  const end = to ? new Date(to) : new Date();       // nếu có to thì lấy to không lấy ngày hiện tại
  start.setHours(0, 0, 0, 0);                     // 
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function ym(year, month) {        // tạo khoảng thời gian 
  return {
    start: new Date(Number(year), Number(month) - 1, 1, 0, 0, 0),      
    end: new Date(Number(year), Number(month), 0, 23, 59, 59, 999)
  };
}