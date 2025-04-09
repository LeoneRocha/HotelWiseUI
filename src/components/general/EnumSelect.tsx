import { Form } from 'react-bootstrap';
import { enumToSelectOptions } from '../../enums/extensions/enumHelper';

interface EnumSelectProps<T extends Record<string, string | number>> {
  enumObject: T;
  name: string;
  value?: string | number | null; // Tornar value opcional
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  descriptionsMap: Record<number | string, string>;
  label?: string;
  required?: boolean;
  invalidFeedback?: string;
  className?: string;
}

function EnumSelect<T extends Record<string, string | number>>({
  enumObject,
  name,
  value,
  onChange,
  descriptionsMap,
  label,
  required = false,
  invalidFeedback,
  className,
}: EnumSelectProps<T>) {
  const options = enumToSelectOptions(enumObject, descriptionsMap);

  // Adota valor vazio ('') se value for nulo, indefinido ou string vazia
  const currentValue = value ?? '';

  return (
    <Form.Group className={className}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Select
        name={name}
        value={currentValue}
        onChange={onChange}
        required={required}
      >
        {/* Opção padrão "Selecione" */}
        <option key="" value="">
          Selecione
        </option>

        {/* Mapeamento de opções */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.description}
          </option>
        ))}
      </Form.Select>

      {/* Feedback de erro */}
      {invalidFeedback && (
        <Form.Control.Feedback type="invalid">
          {invalidFeedback}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
}

export default EnumSelect;
