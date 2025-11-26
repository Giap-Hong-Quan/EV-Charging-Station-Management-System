export const config = {
  port: process.env.PORT || 8000, // <--- FIX QUAN TRỌNG

  stationService: {
    baseUrl: "http://station_management_service:5001"
  },
  userService: {
    baseUrl: "http://user_service:8082"
  },
  bookingService: {
    baseUrl: "http://booking_service:5000"
  },
  analyticsService: {
    baseUrl: "http://analytics_reporting_service:5002"
  },
  sessionService: {
    baseUrl: "http://charging_session_service:5003"  
  },
   paymentService: {
    baseUrl: "http://payment_service:5004"  
  }
};
