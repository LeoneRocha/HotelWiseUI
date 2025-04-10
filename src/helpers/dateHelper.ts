// Parse dates
export const parseDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
};

export const parseDateNull = (dateString: string | undefined) => {
    if (!dateString) return undefined; // Alterado de "null" para "undefined"
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date; // Alterado de "null" para "undefined"
};