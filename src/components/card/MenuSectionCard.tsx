import React, { useEffect, useState } from "react";
import CustomCheckbox from "../CustomCheckbox";
import { Card, Pagination } from "react-bootstrap";
import CustomPagination from "../CustomPagination";

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

const MenuSectionCard: React.FC<MenuSectionCardProps> = ({ isAdmin, name, items, buttons }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    setCurrentPage(1);
  });

  const paginatedData = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="d-flex justify-content-center align-item-center">
      <Card style={{ width: "800px" }}>
        <Card.Header>
        <div className="d-flex justify-content-between">
            <div>
              <span>{name}</span>
            </div>
            <CustomPagination
            itemsCount={items.length}
            itemsPerPage={pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            alwaysShown={true}
            />
          </div>

          <div>
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
        </Card.Header>
        <Card.Body>
          {items.length > 0 ? (
              <div>
                {paginatedData.map((item) => (
                  <CustomCheckbox label={item.name} />
                ))}
              </div>
            ) : (
              <p className="text-muted">There no items</p>
            )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default MenuSectionCard;
