export const getFromStorage = (key) => {
    const item = localStorage.getItem(key);
    if (item) {
        try {
            return JSON.parse(item);
        } catch (e) {
            console.error(`Ошибка при чтении ${key} из localStorage:`, e);
            return null;
        }
    }
    return null;
};

export const setInStorage = (key, value) => {
    try {
        const item = JSON.stringify(value);
        localStorage.setItem(key, item);
    } catch (e) {
        console.error(`Ошибка при записи в localStorage:`, e);
    }
};

export const removeFromStorage = (key) => {
    localStorage.removeItem(key);
};

export const clearStorage = () => {
    localStorage.clear();
};
