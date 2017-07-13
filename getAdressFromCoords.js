// Определяем адрес по координатам (обратное геокодирование).
module.exports = {
    getAddress(coords, myPlacemark) {
        return ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0),
                v = {
                    address: firstGeoObject.getAddressLine()
                };

            return v;
        })
    }
}

