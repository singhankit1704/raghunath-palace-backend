import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

await prisma.room.createMany({
  data: [
    { name:"Ganga View Deluxe", bedType:"Double", price:5000, view:"Ganga", ac:true, bathroom:true, images:["1.jpg"] },
    { name:"Ganga View Premium", bedType:"Double", price:4500, view:"Ganga", ac:true, bathroom:true, images:["2.jpg"] },
    { name:"Standard AC", bedType:"Double", price:3000, view:"Ganga", ac:true, bathroom:true, images:["3.jpg"] },
    { name:"Budget AC", bedType:"Single", price:2500, view:"Ganga", ac:true, bathroom:true, images:["4.jpg"] },
    { name:"Ganga View", bedType:"Double", price:4000, view:"Ganga", ac:true, bathroom:true, images:["5.jpg"] },
    { name:"Ganga View", bedType:"Double", price:4000, view:"Ganga", ac:true, bathroom:true, images:["6.jpg"] }
  ]
})

console.log("Rooms added")
