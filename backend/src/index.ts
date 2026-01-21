import server from "./server.js";


const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`server funcionando en el puerto ${port}`)
})
