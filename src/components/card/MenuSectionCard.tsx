import React from "react";
import CustomCheckbox from "../CustomCheckbox";

interface Button {
  label: string;
  bootstrap_color: string;
  onClick: () => void;
}

interface MenuSectionCardProps {
  isAdmin: boolean;
  name: string;
  items: { name: string; price: number }[];
  buttons: Button[];
}

const MenuSectionCard: React.FC<MenuSectionCardProps> = ({
  isAdmin,
  name,
  items,
  buttons,
}) => {
  return (
    <div className="d-flex justify-content-center align-item-center">
      <div className="card border-light" style={{ width: "800px" }}>
        <div className="card-header d-flex align-items-center">
          <span>{name}</span>
          {isAdmin && (
            <div>
              {buttons.map((button, index) => (
                <button
                  key={index}
                  className={`btn btn-sm ${button.bootstrap_color} ms-2`}
                  onClick={button.onClick}
                >
                  {button.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card-body">
          {items.length > 0 ? (
            <div>
              {items.map((item) => (
                <CustomCheckbox label={item.name} />
              ))}
            </div>
          ) : (
            <p className="text-muted">There no items</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuSectionCard;
