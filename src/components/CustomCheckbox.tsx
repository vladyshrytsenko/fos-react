import { Form } from "react-bootstrap";

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (isChecked: boolean) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, checked, onChange }) => (
  <Form>
    <div className="mb-1">
      <Form.Check
        type="checkbox"
        id={`checkbox-${label}`}
        label={label}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        />
    </div>
  </Form>
);
  
  export default CustomCheckbox;