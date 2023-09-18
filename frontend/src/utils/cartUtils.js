export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  //Calculation for item price
  state.ItemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  //Calculation for shipping price (if order is over $100 the free else $10 shipping)
  state.shippingPrice = addDecimals(state.ItemsPrice > 100 ? 0 : 10);

  //Calculation for tax price (15% tax)
  state.taxPrice = addDecimals(Number(state.ItemsPrice * 0.15).toFixed(2));

  //Calculation for total price
  state.totalPrice = (
    Number(state.ItemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
