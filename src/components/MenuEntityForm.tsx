import { useState } from "react";
import { Button } from "react-bootstrap";

interface Field {
    name: string;
    label: string;
    type: "text" | "number" | "select";
    required?: boolean;
    min?: number;
    options?: string[];
}

interface MenuEntityFormProps {
    entityType: string;
    fields: Field[];
    onSubmit: (data: Record<string, string | number>) => void;
}

const MenuEntityForm: React.FC<MenuEntityFormProps> = ( {entityType, fields, onSubmit } ) => {
    const [formData, setFormData] = useState<Record<string, string | number>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSumbit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    }

    return (
        <form onSubmit={handleSumbit}>
            {fields.map((field) => (
                <div className="mb-3" key={field.name}>
                    <label className="form-label">{field.label}:</label>
                    {field.type === "select" ? (
                        <select className="form-control" name={field.name} onChange={handleChange} required={field.required}>
                            <option value="" disabled>Select {field.label.toLowerCase()}</option>
                            {field.options?.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    ) : (
                        <input type={field.type} className="form-control" name={field.name} min={field.min} required={field.required} onChange={handleChange}/>
                    )}
                </div>
            ))}
            <Button type="submit">Save</Button>
        </form>
    )
};

export default MenuEntityForm;
