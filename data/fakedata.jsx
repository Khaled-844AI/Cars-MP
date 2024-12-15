import {faker} from '@faker-js/faker'

function createRandomCarList(){

    return {
        name:faker.vehicle.vehicle(),
        fuelType:faker.vehicle.fuel(),
        model:faker.vehicle.model(),
        type:faker.vehicle.type(),
        image:'/BMW.png',
        miles:1000,
        gearType:'Automatic',
        price:faker.finance.amount({min:10000 , max:50000}),
    }
}

const carList = faker.helpers.multiple(createRandomCarList,{
    count:16
})

export default {
    carList
}