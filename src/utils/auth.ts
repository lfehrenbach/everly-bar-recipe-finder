export async function checkPassword(): Promise<boolean> {
  const password = prompt("Enter admin password");
  return password === "everlysecret"; // 🔐 Replace with your own password
}
