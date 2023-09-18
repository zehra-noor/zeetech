import { ORDERS_URL, PAYPAL_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({ url: ORDERS_URL }),
      keepUnusedDataFor: 5,
    }),

    getOrderDetails: builder.query({
      query: (orderId) => ({ url: `${ORDERS_URL}/${orderId}` }),
      keepUnusedDataFor: 5,
    }),

    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: { ...order },
      }),
    }),

    updatePayOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
      }),
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    payOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/payment`,
        method: "POST",
        body: {
          orderId,
        },
      }),
    }),

    // payOrder: builder.mutation({
    //   query: ({ source, amount }) => ({
    //     url: `${ORDERS_URL}/payment`,
    //     method: "POST",
    //     body: {
    //       source,
    //       amount,
    //     },
    //   }),
    // }),
  }),
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useUpdatePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  usePayOrderMutation,
} = ordersApiSlice;
