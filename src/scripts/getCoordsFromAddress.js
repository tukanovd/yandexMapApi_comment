module.exports = {
    getCoords(address) {
        return ymaps.geocode(address, {results: 1})
            .then((res) => {
                var firstObject = res.geoObjects.get(0),
                    coords = firstObject.geometry.getCoordinates();

                return coords;
            })
    }
}

