import Stripe from "stripe";
import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";

const stripe = new Stripe(
  "sk_test_51Nl4N2LRTa7rDSdpY2PiAJOOHNaTusCBmCzSb3Oi2AtttWfgeu8E6hjxrJKNkwAVfAL1XmSJUNoTO8c3SzojDTge00zFDgdC1t",
  {
    apiVersion: "2023-08-16",
  }
);

// @desc    Create new Order
// @route   Post /api/orders
// @access  private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No Order Items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc    update order to paid
// @route   PUT /api/orders/:id/pay
// @access  private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // order.paymentResults = {
    //   id: req.body.id,
    //   status: req.body.status,
    //   update_time: req.body.update_time,
    //   email_address: req.body.payer.email_address,
    // };
    const updateOrder = await order.save();

    res.status(200).json(updateOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  private/admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updateOrder = await order.save();
    res.status(200).json(updateOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  private/admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.status(200).json(orders);
});

// @desc    Pay an order
// @route   POST /api/orders
// @access  private
const payOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.body.orderId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: order.orderItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.qty,
      };
    }),
    success_url: `http://localhost:3000/order/${req.body.orderId}`, //paid against ordernumber
    cancel_url: `http://localhost:3000/cancel.html`,
  });

  //res.redirect(303, session.url);
  res.json({ url: session.url });
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  payOrder,
};
