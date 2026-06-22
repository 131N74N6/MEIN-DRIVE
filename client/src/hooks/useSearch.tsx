import { useState } from "react";
import useDebounce from "./useDebounce";

export default function useSearch() {
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearch = useDebounce<string>(searchValue, 500);
    
    return { debouncedSearch, searchValue, setSearchValue }
}