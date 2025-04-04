import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import MenuSectionCard from "../../components/card/MenuSectionCard";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { Dessert } from "../../models/dessert";
import { Drink } from "../../models/drink";
import { Meal } from "../../models/meal";
import { Order } from "../../models/order";
import drinkService from "../../services/drinkService";
import mealService from "../../services/mealService";
import dessertService from "../../services/dessertService";
import storageService from "../../services/storageService";
import userService from "../../services/userService";
import MyModal from "../../components/BootstrapModal";
import { Button } from "react-bootstrap";
import BootstrapModal from "../../components/BootstrapModal";
import { Cuisine } from "../../models/cuisine";
import cuisineService from "../../services/cuisineService";
import MenuEntityForm from "../../components/MenuEntityForm";

const MenuPage: React.FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [desserts, setDesserts] = useState<Dessert[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);

  const [createCuisineModalShow, setCreateCuisineModalShow] = useState(false);
  const [createMealModalShow, setCreateMealModalShow] = useState(false);
  const [createDrinkModalShow, setCreateDrinkModalShow] = useState(false);
  const [createDessertModalShow, setCreateDessertModalShow] = useState(false);

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

  function showCreateCuisineModal() {
    setCreateCuisineModalShow(true);
  }

  function showCreateDrinkModal() {
    setCreateDrinkModalShow(true);
  }

  function showCreateDessertModal() {
    setCreateDessertModalShow(true);
  }

  function showCreateMealModal() {
    setCreateMealModalShow(true);
  }

  const handleCuisineSubmit = async (data: Record<string, string | number>) => {
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

  const handleMealSubmit = async (data: Record<string, string | number>) => {
    try {
      const createdMeal = await mealService.create({
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

  const handleDrinkSubmit = async (data: Record<string, string | number>) => {
    try {
      const createdDrink = await drinkService.create({
        name: data.name as string,
        price: data.price as number
      });
  
      setDrinks([...drinks, createdDrink]);
      setCreateDrinkModalShow(false);
    } catch (error) {
      console.error("Error creating drink", error);
    }
  };

  const handleDessertSubmit = async (data: Record<string, string | number>) => {
    try {
      const createdDessert = await dessertService.create({
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

  interface Button {
    label: string;
    bootstrap_color: string;
    onClick: () => void;
  }

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
              onSubmit={handleCuisineSubmit}
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
              onSubmit={handleMealSubmit}
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
              onSubmit={handleDrinkSubmit}
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
              onSubmit={handleDessertSubmit}
            />
          }
        />
      </>

      <section>
        <MenuSectionCard
          isAdmin={isAdmin}
          name="Drinks"
          items={drinks}
          buttons={
            [
              {
                label: "Create",
                bootstrap_color: "btn-primary",
                onClick: showCreateDrinkModal,
              },
            ] as unknown as Button[]
          }
        />

        <MenuSectionCard
          isAdmin={isAdmin}
          name="Meals"
          items={meals}
          buttons={
            [
              {
                label: "Create",
                bootstrap_color: "btn-primary",
                onClick: showCreateMealModal,
              },
              {
                label: "Create cuisine",
                bootstrap_color: "btn-secondary",
                onClick: showCreateCuisineModal,
              },
            ] as unknown as Button[]
          }
        />
        <MenuSectionCard
          isAdmin={isAdmin}
          name="Desserts"
          items={desserts}
          buttons={
            [
              {
                label: "Create",
                bootstrap_color: "btn-primary",
                onClick: showCreateDessertModal,
              },
            ] as unknown as Button[]
          }
        />

        <div>
          <h5>Total price: {123} usd</h5>
          <button type="button" className="btn btn-primary">
            Order now
          </button>
        </div>
      </section>
    </div>
  );
};

export default MenuPage;
