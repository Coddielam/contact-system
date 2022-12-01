export const getFullName = (firstName: string, lastName: string) => {
  return (
    firstName[0].toUpperCase() +
    firstName.slice(1).toLowerCase() +
    " " +
    lastName[0].toUpperCase() +
    lastName.slice(1).toLowerCase()
  );
};
