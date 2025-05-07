import React, { useEffect, useState } from "react";
import MenuSectionCard from "../components/card/MenuSectionCard";
import CustomNavbar from "../components/navbar/CustomNavbar";
import { Dessert } from "../models/dessert";
import { Drink } from "../models/drink";
import { Meal } from "../models/meal";
import { Order } from "../models/order";
import drinkService from "../services/drinkService";
import mealService from "../services/mealService";
import dessertService from "../services/dessertService";
import userService from "../services/userService";
import BootstrapModal from "../components/BootstrapModal";
import { Cuisine } from "../models/cuisine";
import cuisineService from "../services/cuisineService";
import MenuEntityForm from "../components/MenuEntityForm";
import orderService from "../services/orderService";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const MenuPage: React.FC = () => {
  const navigate = useNavigate();

  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [desserts, setDesserts] = useState<Dessert[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);

  const [createCuisineModalShow, setCreateCuisineModalShow] = useState(false);
  const [createMealModalShow, setCreateMealModalShow] = useState(false);
  const [createDrinkModalShow, setCreateDrinkModalShow] = useState(false);
  const [createDessertModalShow, setCreateDessertModalShow] = useState(false);

  const [isDrinkBulkDeletionEnabled, setDrinkBulkDeletionEnabled] = useState(false);
  const [isDessertBulkDeletionEnabled, setDessertBulkDeletionEnabled] = useState(false);
  const [isMealBulkDeletionEnabled, setMealBulkDeletionEnabled] = useState(false);

  const [order, setOrder] = useState<Order>({
    dessertNames: [],
    drinkNames: [],
    mealNames: [],
    payment: null,
    totalPrice: 0
  });

  const isAdmin: boolean = userService.isAdmin();

  useEffect(() => {
    Promise.all([
      drinkService.findAll().catch(error => {
        console.error("Error fetching drink: ", error);
        return [];
      }),
      mealService.findAll().catch(error => {
        console.error("Error fetching meal: ", error);
        return [];
      }),
      dessertService.findAll().catch(error => {
        console.error("Error fetching dessert: ", error);
        return [];
      }),
      cuisineService.findAll().catch(error => {
        console.error("Error fetching cuisine: ", error);
        return [];
      })
    ])
      .then(([drinkData, mealData, dessertData, cuisineData]) => {
        setDrinks(drinkData);
        setMeals(mealData);
        setDesserts(dessertData);
        setCuisines(cuisineData);
      });
  }, []);

  const showCreateCuisineModal = () => setCreateCuisineModalShow(true);
  const showCreateDrinkModal = () => setCreateDrinkModalShow(true);
  const showCreateDessertModal = () => setCreateDessertModalShow(true);
  const showCreateMealModal = () => setCreateMealModalShow(true);

  const handleCuisineCreateSubmit = async (data: Record<string, string | number>) => {
    try {
      const createdCuisine = await cuisineService.create({
        name: data.name as string,
      });
  
      setCuisines([...cuisines, createdCuisine]);
      setCreateCuisineModalShow(false);
    } catch (error) {
      console.error("Error creating cuisine", error);
    }
  };

  const handleMealDeleteSelected = async () => {
    try {
      const ids = order.meals!.map(meal => meal.id);
      await mealService.deleteAllByIds(ids);
  
      setOrder(prev => ({
        ...prev,
        meals: [],
        mealNames: [],
        totalPrice: prev.totalPrice - order.meals!.reduce((acc, meal) => acc + meal.price, 0)
      }));

      mealService.findAll().then(data => setMeals(data));
    } catch (error) {
      console.error("Failed to delete selected meals", error);
    }
  };

  const handleMealCreateSubmit = async (data: Record<string, string | number>) => {
    try {
      const createdMeal = await mealService.create({
        id: data.id as number,
        name: data.name as string,
        price: data.price as number,
        portionWeight: data.portionWeight as number,
        cuisineName: data.cuisineName as string
      });
  
      setMeals([...meals, createdMeal]);
      setCreateMealModalShow(false);
    } catch (error) {
      console.error("Error creating meal", error);
    }
  };

  const handleDrinkDeleteSelected = async () => {
    try {
      const ids = order.drinks!.map(drink => drink.id);
      await drinkService.deleteAllByIds(ids);
  
      setOrder(prev => ({
        ...prev,
        drinks: [],
        drinkNames: [],
        totalPrice: prev.totalPrice - order.drinks!.reduce((acc, drink) => acc + drink.price, 0)
      }));

      drinkService.findAll().then(data => setDrinks(data));
    } catch (error) {
      console.error("Failed to delete selected drinks", error);
    }
  };

  const handleDrinkCreateSubmit = async (data: Record<string, string | number>) => {
    try {
      const createdDrink = await drinkService.create({
        id: data.id as number,
        name: data.name as string,
        price: data.price as number
      });
  
      setDrinks([...drinks, createdDrink]);
      setCreateDrinkModalShow(false);
    } catch (error) {
      console.error("Error creating drink", error);
    }
  };

  const handleDessertDeleteSelected = async () => {
    try {
      const ids = order.desserts!.map(dessert => dessert.id);
      await dessertService.deleteAllByIds(ids);
  
      setOrder(prev => ({
        ...prev,
        desserts: [],
        dessertNames: [],
        totalPrice: prev.totalPrice - order.desserts!.reduce((acc, dessert) => acc + dessert.price, 0)
      }));

      dessertService.findAll().then(data => setDesserts(data));
    } catch (error) {
      console.error("Failed to delete selected desserts", error);
    }
  };

  const handleDessertCreateSubmit = async (data: Record<string, string | number>) => {
    try {
      const createdDessert = await dessertService.create({
        id: data.id as number,
        name: data.name as string,
        price: data.price as number,
        portionWeight: data.portionWeight as number
      });
  
      setDesserts([...desserts, createdDessert]);
      setCreateDessertModalShow(false);
    } catch (error) {
      console.error("Error creating dessert", error);
    }
  };

  const submitOrder = async () => {
    console.log('Order submitted:', order);

    order.iceCubes = true;
    order.lemon = true;
    order.totalPrice = parseFloat(order.totalPrice.toFixed(2)) * 100; // in cents

    try {
      const createdOrder = await orderService.create(order);
      console.log('Order created successfully:', createdOrder);
      navigate(`/payment/${createdOrder.payment?.id}?totalPrice=${order.totalPrice}`);
    } catch (error) {
      console.error('Failed to submit order:', error);
    }
  };

  return (
    <div>
      <CustomNavbar />
      <>
        <BootstrapModal
          show={createCuisineModalShow}
          onHide={() => setCreateCuisineModalShow(false)}
          title="Create cuisine form"
          content={
            <MenuEntityForm
              entityType={"Cuisine"}
              fields={[
                { name: "name", label: "Name", type: "text", required: true },
              ]}
              onSubmit={handleCuisineCreateSubmit}
            />
          }
        />
        <BootstrapModal
          show={createMealModalShow}
          onHide={() => setCreateMealModalShow(false)}
          title="Create meal form"
          content={
            <MenuEntityForm
              entityType={"Meal"}
              fields={[
                { name: "name", label: "Name", type: "text", required: true },
                {
                  name: "price",
                  label: "Price (USD)",
                  type: "number",
                  min: 0.0,
                  required: true,
                },
                {
                  name: "portionWeight",
                  label: "Portion weight (g)",
                  type: "number",
                  min: 10,
                  required: true,
                },
                {
                  name: "cuisineName",
                  label: "Cuisine",
                  type: "select",
                  options: cuisines.map((c) => c.name),
                  required: true,
                },
              ]}
              onSubmit={handleMealCreateSubmit}
            />
          }
        />
        <BootstrapModal
          show={createDrinkModalShow}
          onHide={() => setCreateDrinkModalShow(false)}
          title="Create drink form"
          content={
            <MenuEntityForm
              entityType={"Drink"}
              fields={[
                { name: "name", label: "Name", type: "text", required: true },
                {
                  name: "price",
                  label: "Price (USD)",
                  type: "number",
                  min: 0.0,
                  required: true,
                },
              ]}
              onSubmit={handleDrinkCreateSubmit}
            />
          }
        />
        <BootstrapModal
          show={createDessertModalShow}
          onHide={() => setCreateDessertModalShow(false)}
          title="Create dessert form"
          content={
            <MenuEntityForm
              entityType={"Dessert"}
              fields={[
                { name: "name", label: "Name", type: "text", required: true },
                {
                  name: "price",
                  label: "Price (USD)",
                  type: "number",
                  min: 0.0,
                  required: true,
                },
                {
                  name: "portionWeight",
                  label: "Portion weight (g)",
                  type: "number",
                  min: 10,
                  required: true,
                },
              ]}
              onSubmit={handleDessertCreateSubmit}
            />
          }
        />
      </>

      <MenuSectionCard
          isAdmin={isAdmin}
          name="Drinks"
          items={drinks}
          buttons={
            [
              {
                label: "create",
                bootstrap_color: "outline-success",
                onClick: showCreateDrinkModal,
                isEnabled: true
              },
              {
                label: "delete selected",
                bootstrap_color: "outline-danger",
                onClick: handleDrinkDeleteSelected,
                isEnabled: isDrinkBulkDeletionEnabled
              }
            ]
          }
          selectedItemNames={order.drinkNames}
          onSelectionChange={(selectedDrinks) => {
            const drinkNames = selectedDrinks.map(drink => drink.name);
            setOrder((prev) => ({ ...prev, drinks: selectedDrinks, drinkNames: drinkNames }));
            setDrinkBulkDeletionEnabled(selectedDrinks.length > 0);
          }}
          onPriceChange={(priceDelta) =>
            setOrder((prev) => ({ ...prev, totalPrice: prev.totalPrice + priceDelta }))
          }
        />

        <MenuSectionCard
          isAdmin={isAdmin}
          name="Meals"
          items={meals}
          buttons={
            [
              {
                label: "create",
                bootstrap_color: "outline-success",
                onClick: showCreateMealModal,
                isEnabled: true
              },
              {
                label: "create cuisine",
                bootstrap_color: "outline-primary",
                onClick: showCreateCuisineModal,
                isEnabled: true
              },
              {
                label: "delete selected",
                bootstrap_color: "outline-danger",
                onClick: handleMealDeleteSelected,
                isEnabled: isMealBulkDeletionEnabled
              }
            ]
          }
          selectedItemNames={order.mealNames}
          onSelectionChange={(selectedMeals) => {
            const mealNames = selectedMeals.map(meal => meal.name);
            setOrder((prev) => ({ ...prev, meals: selectedMeals, mealNames: mealNames }));
            setMealBulkDeletionEnabled(selectedMeals.length > 0);
          }}
          onPriceChange={(priceDelta) =>
            setOrder((prev) => ({ ...prev, totalPrice: prev.totalPrice + priceDelta }))
          }
        />
        <MenuSectionCard
          isAdmin={isAdmin}
          name="Desserts"
          items={desserts}
          buttons={
            [
              {
                label: "create",
                bootstrap_color: "outline-success",
                onClick: showCreateDessertModal,
                isEnabled: true
              },
              {
                label: "delete selected",
                bootstrap_color: "outline-danger",
                onClick: handleDessertDeleteSelected,
                isEnabled: isDessertBulkDeletionEnabled
              }
            ]
          }
          selectedItemNames={order.dessertNames}
          onSelectionChange={(selectedDesserts) => {
            const dessertNames = selectedDesserts.map(dessert => dessert.name);
            setOrder((prev) => ({ ...prev, desserts: selectedDesserts, dessertNames: dessertNames }));
            setDessertBulkDeletionEnabled(selectedDesserts.length > 0);
          }}
          onPriceChange={(priceDelta) =>
            setOrder((prev) => ({ ...prev, totalPrice: prev.totalPrice + priceDelta }))
          }
        />

        <div>
          <h5>Total price: {order.totalPrice.toFixed(2)} usd</h5>
          <Button onClick={submitOrder} variant="primary">Order now</Button>
        </div>
    </div>
  );
};

export default MenuPage;
