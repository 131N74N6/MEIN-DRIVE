import { useEffect, useState } from "react";

export default function useDebounce<E>(value: E, delay: number): E {
    const [debouncedValue, setDebouncedValue] = useState<E>(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}