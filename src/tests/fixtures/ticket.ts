import { TicketInfo } from "../../types/ticket";

export const defaultTicket = {
  serviceId: "",
  serviceName: "",
  name: "",
  firstName: "",
  email: "",
  phone: "",
  code: "",
  rgpdAccepted: false,
};

export const ticket: TicketInfo = { 
  id: "123", 
  serviceId: "service-1",
  serviceName: "Service test",
  name: "Doe",
  firstName: "John",
  email: "john.doe@example.com",
  phone: "0123456789",
  code: "ABC123",
  rgpdAccepted: true,
};