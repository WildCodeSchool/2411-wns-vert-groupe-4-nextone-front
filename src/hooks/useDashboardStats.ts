import { useQuery, useSubscription } from "@apollo/client";
import { GET_TICKETS_PAGINATED } from "@/requests/queries/ticket.query";
import { TICKETS_CHANGED_SUBSCRIPTION } from "@/requests/subscriptions/ticket.subscription";
import { GetTicketsPaginatedResult } from "@/types/ticket";
import { useMemo } from "react";

export const useDashboardStats = () => {
  const todayStart = useMemo(() => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    return date;
  }, []);

  const { data, refetch, loading } = useQuery<GetTicketsPaginatedResult>(
    GET_TICKETS_PAGINATED,
    {
      variables: {
        fields: {},
        pagination: {
          limit: 10000,
        },
      },
      fetchPolicy: "network-only",
    }
  );

  useSubscription(TICKETS_CHANGED_SUBSCRIPTION, {
    onData: () => {
      refetch();
    },
  });

  const allTickets = useMemo(() => {
    return data?.ticketsByProperties?.items || [];
  }, [data]);

  const processedTicketsCount = useMemo(() => {
    const ticketsProcessedToday = allTickets.filter((ticket) => {
      const isDoneOrArchived = ["DONE", "ARCHIVED"].includes(ticket.status);
      const updatedDate = new Date(ticket.updatedAt);
      return isDoneOrArchived && updatedDate >= todayStart;
    });

    return ticketsProcessedToday.length;
  }, [allTickets, todayStart]);

  const pendingTicketsCount = useMemo(() => {
    return allTickets.filter((t) => t.status === "PENDING").length;
  }, [allTickets]);

  const inProgressTicketsCount = useMemo(() => {
    return allTickets.filter((t) => t.status === "INPROGRESS").length;
  }, [allTickets]);

  const averageProcessingTime = useMemo(() => {
    const ticketsProcessedToday = allTickets.filter((ticket) => {
      const isDoneOrArchived = ["DONE", "ARCHIVED"].includes(ticket.status);
      const updatedDate = new Date(ticket.updatedAt);
      return isDoneOrArchived && updatedDate >= todayStart;
    });

    if (ticketsProcessedToday.length === 0) return null;

    const totalTime = ticketsProcessedToday.reduce((acc: number, ticket) => {
      const created = new Date(ticket.createdAt).getTime();
      const updated = new Date(ticket.updatedAt).getTime();
      return acc + (updated - created);
    }, 0);

    const averageMs = totalTime / ticketsProcessedToday.length;

    const days = Math.floor(averageMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (averageMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((averageMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((averageMs % (1000 * 60)) / 1000);

    let formatted = "";

    if (days > 0) {
      formatted = `${days}j ${hours}h`;
    } else if (hours > 0) {
      formatted = `${hours}h ${minutes}min`;
    } else if (minutes > 0) {
      formatted = `${minutes}min ${seconds}sec`;
    } else {
      formatted = `${seconds}sec`;
    }

    return {
      days,
      hours,
      minutes,
      seconds,
      formatted,
    };
  }, [allTickets, todayStart]);

  return {
    loading,
    processedTicketsCount,
    pendingTicketsCount,
    inProgressTicketsCount,
    averageProcessingTime,
  };
};
