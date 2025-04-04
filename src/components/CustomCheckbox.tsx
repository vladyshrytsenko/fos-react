import { Form } from "react-bootstrap";

interface CustomCheckboxProps {
    label: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label }) => {
    return (
      <Form>
        <div key={"default-checkbox"} className="mb-3">
            <Form.Check
              type="checkbox"
              id={"default-checkbox"}
              label={label}
            />
          </div>
      </Form>
    );
  }
  
  export default CustomCheckbox;