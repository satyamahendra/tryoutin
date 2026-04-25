"use client"

import {usePathname, useSearchParams, useRouter} from "next/navigation"
import {Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious} from "../ui/pagination"

type PaginationParamsProps = {
    pageCount: number
}

const PaginationParams = ({pageCount}: PaginationParamsProps) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const currPage = Number(searchParams.get("page")) || 1

    const handleSelectPage = (page: number) => {
        const params = new URLSearchParams(searchParams)
        if (page) {
            params.set("page", page.toString())
        } else {
            params.delete("page")
        }
        router.replace(`${pathname}?${params.toString()}`)
    }

    const handleNextPage = () => {
        if (currPage < pageCount) handleSelectPage(currPage + 1)
    }

    const handlePrevPage = () => {
        if (currPage > 1) handleSelectPage(currPage - 1)
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious onClick={handlePrevPage} />
                </PaginationItem>
                {Array.from({length: pageCount}, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink onClick={() => handleSelectPage(page)} isActive={currPage == page}>
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext onClick={handleNextPage} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default PaginationParams
