import { adminService } from "@/service/admin";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";


export const useSearchPage = () => {
    const [search, setSearch] = useState("")

    const [debouncedSearch] = useDebounce(search, 300);
    const { data: results, isLoading, isError } = useQuery({
        queryKey: ['search-guests', debouncedSearch],
        queryFn: () => {
            return adminService.infoSearch(debouncedSearch)
        },
        enabled: debouncedSearch.trim().length > 0,
        refetchOnWindowFocus: false,
    })

    return { search, setSearch, debouncedSearch, results, isLoading, isError }
}