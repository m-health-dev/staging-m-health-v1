const allowOauth = true;
const allowEmail = true;
const allowPassword = true;

export const getAuthTypes = () => {
  return { allowOauth, allowEmail, allowPassword };
};
