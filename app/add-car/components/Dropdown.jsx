'use client'
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "./../../../components/ui/select"
  

function Dropdown({item, handleFormChange, carInfo}) {
  return (
        <Select 
         onValueChange={(value)=>handleFormChange(item.name, value)}
         required={item.required}
         >
        <SelectTrigger className="w-full bg-transparant">
            <SelectValue placeholder={carInfo?.[item.name]} />
        </SelectTrigger>
        <SelectContent>
            {item?.options?.map((option, index)=>(
                <SelectItem value={option} key={index}>{option}</SelectItem>
            ))  
            }
        </SelectContent>
        </Select>
  )
}

export default Dropdown