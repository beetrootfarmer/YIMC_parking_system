export const maskName = (name: string | undefined | null): string => {
  if (!name) return '';
  const strName = String(name);
  if (strName.length <= 1) return strName;
  if (strName.length === 2) return strName[0] + '*';
  return strName[0] + '*'.repeat(strName.length - 2) + strName[strName.length - 1];
};

export const maskCarNumber = (carNum: string | undefined | null): string => {
  if (!carNum) return '';
  const strCarNum = String(carNum);
  if (strCarNum.length < 4) return strCarNum;
  const last4 = strCarNum.slice(-4);
  return strCarNum.replace(last4, '**' + last4.slice(2));
};
