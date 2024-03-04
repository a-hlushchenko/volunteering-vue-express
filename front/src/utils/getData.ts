import { serverUrl } from "./serverUrl";

//отримання списку міст
export async function getLocationList() {
  try {
    const res = await fetch(`${serverUrl}/location`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (res.ok) {
      return data.list;
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
}

//отримання списку категорій
export async function getCategoryList() {
  try {
    const res = await fetch(`${serverUrl}/category`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (res.ok) {
      return data.list;
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
}

//отримання списку типів повідомлень
export async function getTypeList() {
  try {
    const res = await fetch(`${serverUrl}/type`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (res.ok) {
      return data.list;
    } else {
      return [];
    }
  } catch (e) {
    return [];
  }
}
