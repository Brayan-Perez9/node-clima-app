const fs = require('fs');

const axios = require ('axios');

class busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor(){

    }

    get paramsMapbox() {
        return {
            'limit': 5,
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY,
            'lang': 'es'
        }
    }

    get paramsWeather(){
        return {
                appid: process.env.OPENWEATHER_KEY,
                units: 'metric',
                lang: 'es'
        }
    }
    async ciudad ( lugar=''){

        try {


            const intance = axios.create({
                
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
                }


            );

            const resp = await intance.get();
           
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }))
         } catch (error) {
            return [];
    }}

    async climaLugar (lat, lon) {
                
        try {

            const instance = axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon}                
            })

            const resp = await instance.get();

            const { weather, main } = resp.data;

            return {
                desc:weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch(error){
            return ('error')
        }
    }

    agregarHistorial(lugar=''){
        
        if ( this.historial.includes( lugar.toLocaleLowerCase())){
            return;
        }
        

        this.historial.unshift( lugar.toLocaleLowerCase());

        this.guardarDB();

    }

    guardarDB() {
        const payload = {
            historial: this.historial
        };
        
        fs.writeFileSync( this.dbPath, JSON.stringify( payload )  );
    }

    leerDB(){

    }

}

module.exports = busquedas;