export function storeMapInLocalStorage(name: string, data: Map<any, any>) {
  const replacer = (key: any, value: any) => {
    if(value instanceof Map) {
      return {
        dataType: "Map",
        value: Array.from(value.entries()),
      };
    } else {
      return value;
    }
  }

  const dataAsJsonStr = JSON.stringify(data, replacer);
  localStorage.setItem(name, dataAsJsonStr);
}

export function loadMapFromLocalStorage(name: string): Map<any, any> {
  const reviver = (key: any, value: any) => {
    if(typeof value === "object" && value != null && value.dataType == "Map") {
      return new Map(value.value)
    }

    return value;
  }

  const itemInLocalStorage = localStorage.getItem(name);
  if(itemInLocalStorage) {
    return JSON.parse(itemInLocalStorage, reviver)!;
  } else {
   return new Map();
  }
}
