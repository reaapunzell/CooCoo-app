import { Form } from "react-router-dom";

const FormInput = ({label, type, value, onChange}) => (
    <div className='form-group'>
        <label>{label}</label>
        <input type={type} value={value} onChange={onChange} required />
    </div>
);

export default FormInput;