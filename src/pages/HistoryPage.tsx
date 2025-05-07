import React, { useEffect, useState } from "react";
import { Order } from "../models/order";
import orderService from "../services/orderService";
import { Dessert } from "../models/dessert";
import { Drink } from "../models/drink";
import { Meal } from "../models/meal";
import { Card, Col, Container, Form, FormSelect, ListGroup, Row } from "react-bootstrap";
import CustomPagination from "../components/CustomPagination";
import CustomNavbar from "../components/navbar/CustomNavbar";

enum SubscriptionOption {
  Admin = 'ADMIN',
  User = 'USER',
  Guest = 'GUEST'
}

const HistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  const findAllOrders = async (size: number) => {
    orderService.findAll(currentPage, size).then(response => {
      const orderContentArr = response.content
        .map((order: { desserts: Dessert[], drinks: Drink[], meals: Meal[] }) => ({
          ...order,
          dessertNames: order.desserts
            .map(dessert => dessert.name) || [],
          drinkNames: order.drinks
            .map(drink => drink.name) || [],
          mealNames: order.meals
            .map(meal => meal.name) || []
        })) || [];

      setOrders(orderContentArr);
      setTotalOrders(response?.totalElements || 0);
    });
  };

  useEffect(() => {
    findAllOrders(pageSize);
  }, [currentPage, pageSize]);

  const onPageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectElement = event.target;
    const newValue = parseInt(selectElement.value, 10);
    setPageSize(newValue);
    findAllOrders(newValue);
  }

  const getDessertTotalPrice = (order: Order): number => {
    let totalPrice = 0;
    order.desserts?.forEach(dessert => {
      totalPrice += dessert.price;
    });

    return parseFloat(totalPrice.toFixed(2));
  }

  const getDrinkTotalPrice = (order: Order): number => {
    let totalPrice = 0;
    order.drinks?.forEach(drink => {
      totalPrice += drink.price;
    });

    return parseFloat(totalPrice.toFixed(2));
  }

  const getMealTotalPrice = (order: Order): number => {
    let totalPrice = 0;
    order.meals?.forEach(meal => {
      totalPrice += meal.price;
    });

    return parseFloat(totalPrice.toFixed(2));
  }

  const getTotalPrice = (order: Order): number => {
    const mealPrice = getMealTotalPrice(order);
    const dessertPrice = getDessertTotalPrice(order);
    const drinkPrice = getDrinkTotalPrice(order);

    const totalPrice = mealPrice + dessertPrice + drinkPrice;
    return parseFloat(totalPrice.toFixed(2));
  }

  return (
    <>
      <CustomNavbar />
      <Container>
        <Row className="justify-content-center mt-4">
          <Col md={2}>
            <CustomPagination
              itemsCount={totalOrders}
              itemsPerPage={pageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              alwaysShown={true}
            />
          </Col>
          <Col md={{ span: 1, offset: 4 }}>
            <Form.Select className="custom-select custom-select-sm" onChange={onPageSizeChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Card className="mb-3" style={{ width: "800px" }}>
            {orders.map((order) => (
              <>
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Order #{order.id}</span>
                    <p className="card-text">
                      <small className="text-muted">Created At: {order.createdAt?.toLocaleString()}</small>
                    </p>
                  </div>
                </Card.Header>

                <Card.Body>
                  <Card.Text>
                    {order.mealNames && order.mealNames.length > 0 && (
                      <>
                        <strong>Meals:</strong> {order.mealNames.join(", ")} ({getMealTotalPrice(order)}$)
                      </>
                    )}
                  </Card.Text>
                  <Card.Text>
                    {order.dessertNames && order.dessertNames.length > 0 && (
                      <>
                        <strong>Desserts:</strong> {order.dessertNames.join(", ")} ({getDessertTotalPrice(order)}$)
                      </>
                    )}
                  </Card.Text>
                  <Card.Text>
                    {order.drinkNames && order.drinkNames.length > 0 && (
                      <>
                        <strong>Drinks:</strong> {order.drinkNames.join(", ")} ({getDrinkTotalPrice(order)}$)
                        {order.iceCubes && (
                          <span className="badge bg-primary ms-2">Ice</span>
                        )}
                        {order.lemon && (
                          <span className="badge bg-warning text-dark ms-2">Lemon</span>
                        )}
                      </>
                    )}
                  </Card.Text>
                  <Card.Text>
                    <strong>Total Price:</strong> ${getTotalPrice(order)}
                  </Card.Text>
                  <label>Subscription:</label>
                  {/* <Form.Select name="selectedSubscription"
              onChange={onSubscriptonChange(order.id, subscriptionSelect.value)}>
              <option *ngFor="let option of subscriptionOptions" [value]="option"> {option} </option>
            </Form.Select> */}
                </Card.Body>
              </>
            ))}
          </Card>
        </Row>
        
        <Row className="justify-content-md-center">
          <Col md={2}>
            <CustomPagination
              itemsCount={totalOrders}
              itemsPerPage={pageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              alwaysShown={true}
            />
          </Col>
          <Col md={{ span: 1, offset: 4 }}>
            <Form.Select className="custom-select custom-select-sm" onChange={onPageSizeChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </Form.Select>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HistoryPage;
