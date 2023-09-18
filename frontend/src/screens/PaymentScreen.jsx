import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Form.Check
            type="radio"
            className="my-2"
            label="Credit Card"
            name="paymentMethod"
            value="Credit Card"
            onChange={(e) => setPaymentMethod(e.target.value)}
            inline
          />
          <Form.Check
            type="radio"
            className="my-2"
            label="Cash on delivery"
            name="paymentMethod"
            value="Cash on delivery"
            onChange={(e) => setPaymentMethod(e.target.value)}
            inline
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
