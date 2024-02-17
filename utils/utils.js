// Generate a random string of a certain length
export function generateRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Generate a string starting with "EaTrading"
export function generateStringStartingWithEaTrade(length) {
  const prefix = "EaTrade";
  const remainingLength = length - prefix.length;
  if (remainingLength <= 0) {
    return prefix;
  }
  return prefix + generateRandomString(remainingLength);
}




