//перевірка існування сесії адміна

import { serverUrl } from "./serverUrl";

export async function checkAccess(token: string) {
  try {
    const res = await fetch(`${serverUrl}/admin/checktoken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    });
    if (res.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
