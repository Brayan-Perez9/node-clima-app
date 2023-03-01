require('dotenv').config()
const { leerInput, inquirerMenu, pausa, listarLugares } = require('./helpers/inquirer');
const busquedas = require('./models/busquedas');
const Busquedas = require('./models/busquedas');

const main = async() => {
    const busqueda = new Busquedas();
    let opt;

    do{

        opt = await inquirerMenu();

        switch(opt){

        
            case 1:
                const termino = await leerInput('ciudad: ');

                const lugares = await busqueda.ciudad ( termino );

                const id = await listarLugares( lugares );
                if (id === '0' ) continue;

                const lugarSel = lugares.find ( l => l.id === id );

                busqueda.agregarHistorial( lugarSel.nombre );
                const clima = await busqueda.climaLugar(lugarSel.lat, lugarSel.lng);  


                console.log('Informacion de la ciudad');
                console.log('Ciudad', lugarSel.nombre );
                console.log('Lat', lugarSel.lat );
                console.log('Lng', lugarSel.lng );
                console.log('Temperatura', clima.temp);
                console.log('Minima', clima.min);
                console.log('Maxima', clima.max);
                console.log('El clima esta: ', clima.desc)

            break;

            case 2: 
                busqueda.hostirial.forEach((lugar, i) => {
                    const idx = `${ i + 1 }`;
                    console.log( `${ idx } ${ lugar }` );
                })
            
            break;
        }

        if ( opt !==0 ) await pausa();

    } while ( opt !== 0)

}

main();