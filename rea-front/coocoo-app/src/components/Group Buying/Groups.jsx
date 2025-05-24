import React from "react";
import "./Onboarding.css";

const Groups = ({ group, selectedGroupId, onSelect}) => {
  return (
    <div className="groups-selection">
      <div className="group" key={group.id}>
        <h3 className="group-name">{group.name}</h3>
        <div className="group-information">
          <div className="select-btn">
            <input
          type="radio"
          name="selectedGroup"
          checked={selectedGroupId === group.id}
          onChange={() => onSelect(group.id)}
        />
          </div>
          <div className="progress">
            <span>Progress</span>
            <p className="number-of-farmers">
              {group.current_progress}/{group.target_goal} farmers
            </p>
          </div>
          <div className="product">
            <span> Product: </span>
            <p className="feed-name">{group.product.name}</p>
          </div>
          <div className="price">
            <span> Price Per Person</span>
            <p className="price">R{group.price_per_person}</p>
          </div>
          <div className="location">
            <span>Location</span>
            <p>
              {group.city.name}, {group.city.province}
            </p>
          </div>
          <div className="status">
            <span>Status: {group.status}</span>
            <p>End Date: {new Date(group.end_date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const fakeGroups = [
  {
    id: 1,
    name: "Johannesburg Poultry Feed Buyers",
    product: {
      name: "Premium Layer Feed",
      description: "This is a premium layer feed for poultry birds.",
      total_price: 1000,
      price_per_unit: 120.0,
      discounted_price: 100.0,
      available_quantity: 100,
      image_url: "https://via.placeholder.com/150",
    },
    city: {
      name: "Johannesburg",
      province: "Gauteng",
    },
    target_goal: 10,
    current_progress: 4,
    price_per_person: 120.0,
    end_date: "2024-12-31T23:59:59Z",
    status: "open",
  },
  {
    id: 2,
    name: "Cape Town Poultry Feed Collective",
    product: {
      name: "Premium Layer Feed",
      description: "This is a premium layer feed for poultry birds.",
      price_per_unit: 120.0,
      discounted_price: 100.0,
      available_quantity: 100,
      image_url: "https://via.placeholder.com/150",
    },
    city: {
      name: "Cape Town",
      province: "Western Cape",
    },
    target_goal: 12,
    current_progress: 5,
    price_per_person: 120.0,
    end_date: "2024-12-31T23:59:59Z",
    status: "open",
  },
  {
    id: 3,
    name: "Durban Poultry Farmers Group",
    product: {
      name: "Premium Layer Feed",
      description: "This is a premium layer feed for poultry birds.",
      price_per_unit: 120.0,
      discounted_price: 100.0,
      available_quantity: 100,
      image_url: "https://via.placeholder.com/150",
    },
    city: {
      name: "Durban",
      province: "KwaZulu-Natal",
    },
    target_goal: 15,
    current_progress: 8,
    price_per_person: 120.0,
    end_date: "2024-12-31T23:59:59Z",
    status: "open",
  },
];

export default Groups;
