import React, { useEffect, useState } from "react";
import CustomCheckbox from "../CustomCheckbox";
import { Button, ButtonGroup, Card, Pagination, Table } from "react-bootstrap";
import CustomPagination from "../CustomPagination";

interface CustomButton {
  label: string;
  bootstrap_color: string;
  onClick: () => void;
  isEnabled: boolean;
}

interface MenuSectionCardProps {
  isAdmin: boolean;
  name: string;
  items: { id: number; name: string; price: number }[];
  buttons: CustomButton[];
  selectedItemNames: string[];
  onSelectionChange: (updated: { id: number; name: string; price: number }[]) => void;
  onPriceChange: (priceDelta: number) => void;
}

const MenuSectionCard: React.FC<MenuSectionCardProps> = ({ 
  isAdmin, 
  name, 
  items, 
  buttons, 
  selectedItemNames, 
  onSelectionChange,
  onPriceChange
}) => {

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 3;
  const paginatedData = items.slice( (currentPage - 1) * pageSize, currentPage * pageSize );

  const handleCheckboxChange = (
    item: { id: number; name: string; price: number }, 
    isChecked: boolean
  ) => {

    let updated: { id: number; name: string; price: number }[];
  
    if (isChecked) {
      updated = [...selectedItemNames
        .map(name => items.find(i => i.name === name)!)
        .filter(Boolean), 
      item];

      onPriceChange(item.price);

    } else {
      updated = selectedItemNames
        .filter(name => name !== item.name)
        .map(name => items.find(i => i.name === name)!)
        .filter(Boolean);

      onPriceChange(-item.price);
    }
  
    onSelectionChange(updated);
  };

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
                <ButtonGroup>
                  {buttons.map((button, index) => (
                      <Button
                        key={index}
                        onClick={button.onClick}
                        size="sm"
                        variant={button.bootstrap_color}
                        disabled={!button.isEnabled}
                      >
                        {button.label}
                      </Button>
                  ))}
                </ButtonGroup>

              </div>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                {/* <th>Portion weight</th> */}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((data) => {
                return (
                  <tr>
                    <td>
                      <CustomCheckbox
                        key={data.id + "_" + data.name}
                        label={data.name}
                        checked={selectedItemNames.includes(data.name)}
                        onChange={(isChecked) =>
                          handleCheckboxChange(data, isChecked)
                        }
                      />
                    </td>
                    <td>{data.price}</td>
                    {/* <td>{data.portionWeight}</td> */}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MenuSectionCard;
