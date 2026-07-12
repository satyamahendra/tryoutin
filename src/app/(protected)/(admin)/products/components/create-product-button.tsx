"use client"

import {Button} from "@/components/ui/button"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {PiPlus} from "react-icons/pi"

const CreateProductButton = () => {
    const {setParams} = useQueryParams()

    return (
        <Button onClick={() => setParams({view: "create"})}>
            <PiPlus />
            Create Product
        </Button>
    )
}

export default CreateProductButton
