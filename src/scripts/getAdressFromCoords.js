module.exports = {
    getAddress(coords) {
        return ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0),
                v = {
                    address: firstGeoObject.getAddressLine()
                };

            return v;
        })
    }
}

