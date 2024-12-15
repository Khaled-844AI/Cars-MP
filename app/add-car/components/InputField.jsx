import React from 'react'
import { Input } from "./../../../components/ui/input"


function InputField({item, handleFormChange , carInfo}) {
  return (
    <div>
        <Input type={item.fieldType}
          name={item.name}
          required={item.required}
          onChange={(e)=>handleFormChange(item.name , e.target.value)}
          defaultValue={carInfo?.[item.name]}
          />
    </div>
  )
}

export default InputField