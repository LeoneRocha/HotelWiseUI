export const getEnumDescription = <T>(_enumObject: T, value: number | string, descriptionMap: Record<number | string, string>): string => {
    return descriptionMap[value] || "Descrição desconhecida";
  };
   

  