export const getEnumDescription = <T>(_enumObject: T, value: number | string, descriptionMap: Record<number | string, string>): string => {
    return descriptionMap[value] || "Descrição desconhecida";
  };
   

  export function enumToSelectOptions<T extends Record<string, string | number>>(
    enumObject: T,
    descriptionMap: Record<number | string, string>
  ): Array<{ value: string | number; label: string; description: string }> {
    // Filtrar mapeamentos reversos que o TypeScript adiciona a enums numéricos
    const entries = Object.entries(enumObject).filter(
      ([key, value]) => typeof value !== "number" || !isNaN(Number(key))
    );
  
    return entries.map(([key, value]) => {
      // Para enums numéricos, usar o valor numérico
      const enumValue = typeof value === "number" ? value : key;
  
      // Obter a label utilizando a função getEnumLabel
      const label = getEnumLabel(enumObject, enumValue);
  
      // Obter a descrição a partir do mapa de descrição
      const description = descriptionMap[enumValue] || "Descrição desconhecida";
  
      return {
        value: enumValue,
        label: label,
        description: description,
      };
    });
  }
  

/**
 * Gets a human-readable label for an enum value
 * @param enumObject The enum object
 * @param value The enum value
 * @returns The formatted label
 */
export function getEnumLabel<T extends Record<string, string | number>>(
  enumObject: T,
  value: string | number
): string {
  const key = Object.keys(enumObject).find(k => enumObject[k] === value);
  if (!key) return String(value);
  
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}
