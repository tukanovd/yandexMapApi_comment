var convertCoordsToAddress = require('./getAdressFromCoords').getAddress,
    convertAddressToCoords = require('./getCoordsFromAddress').getCoords,
    setClusterer = require('./clusterer').setClusterer,
    getCustomBaloon = require('./balloonContentLayoutModel').getCustomBalloonLayout,
    map,
    myClusterer,
    rewiewTemplate = `
{{#each address}}
	<div class="review-contanier">
		<div class="name">{{name}}</div>
		<div class="place">{{place}}</div>
		<div class="date">{{date}}</div>
		<br>
		<div class="review">{{review}}</div>
	</div>
{{/each}}`
;

new Promise(resolve => window.onload = resolve)
    .then(response => new Promise(resolve => ymaps.ready(resolve)))
    .then(() => {
        map = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 10
        });
        setStorageEventListener();
        myClusterer = setClusterer();
        map.geoObjects.add(myClusterer);

        if (localStorage.length > 0) {
            getPointsFromStorage(localStorage);
        }

        map.events.add('click', (e) => {
            var coords = e.get('coords');

            convertCoordsToAddress(coords)
                .then(res => {
                    getBalloon(res, coords);
                })
        })
    })
    .catch(e => alert('Ошибка: ' + e.message));

function getPointsFromStorage(storage) {
    let marks = Object.keys(storage);

    for (let i = 0; i < storage.length; i++) {
        let mark = JSON.parse(storage.getItem(marks[i]));
        if (mark !== null) {
            for (let i = 0; i < mark.length; i++) {
                let myPlaceMark = setPlacemark(mark[i].coords, mark[i]);

                myClusterer.add(myPlaceMark);
            }
        }
    }
};

function setStorageEventListener() {
    var originalSetItem = localStorage.setItem;

    localStorage.setItem = function () {
        var event = new CustomEvent('itemInserted', {'detail': arguments});
        document.dispatchEvent(event);

        originalSetItem.apply(this, arguments);
    };
    var storageHandler = function (e) {
        var address = e.detail[0],
            obj = JSON.parse(e.detail[1]);
        showRewiews(address, obj);
    };

    document.addEventListener("itemInserted", storageHandler);
};

function getBalloon(data = {}, coords) {
    setMapOptions(data);
    map.balloon.open(coords)
        .then(() => showRewiews(data.address));
};

function setMapOptions(data) {
    map.balloon.setOptions({
        offset: [0, -20],
        'layout': getCustomBaloon(data)
    });

    map.events.add(['balloonopen'], (e) => {
        let balloon_container = document.querySelector('.balloon_container');

        balloon_container.querySelector('.header_closeBalloon')
            .addEventListener('click', () => map.balloon.close());
        balloon_container.querySelector('.submit')
            .onclick = (e) => {
            submitReview(e.target.parentNode);
        }
    });
};

function submitReview(target) {
    let name = target.querySelector('#name'),
        place = target.querySelector('#place'),
        review = target.querySelector('#comment'),
        address = target.parentElement.querySelector('.header_address').innerHTML;

    convertAddressToCoords(address).then((coords) => {
        let data = {
                date: getCurrentDate(),
                coords: coords,
                name: name.value,
                review: review.value,
                place: place.value,
                address: address
            },
            obj = {},
            newPlacemark = setPlacemark(coords, data);

        obj[address] = [];
        myClusterer.add(newPlacemark);
        if (localStorage.hasOwnProperty(address)) {
            obj[address] = JSON.parse(localStorage.getItem(address)).concat(data);
        }
        else {
            obj[address].push(data);
        }
        localStorage.setItem(address, JSON.stringify(obj[address]));
    });
};

function setPlacemark(coords, data) {
    let newPlacemark = new ymaps.Placemark(coords, data, {
        openBalloonOnClick: false
    });
    newPlacemark.events.add('click', (e) => {
        let data = e.get('target').properties.getAll();

        getBalloon(data, data.coords);
    });

    return newPlacemark;
};

function showRewiews(address, obj) {
    if (!obj && localStorage.getItem(address)) {
        obj = JSON.parse(localStorage.getItem(address));
    }
    let doc = document.querySelector('#reviews'),
        tempFn = Handlebars.compile(rewiewTemplate),
        temp = tempFn({address: obj});

    doc.innerHTML = temp;
};

function getCurrentDate() {
    let options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timezone: 'UTC'
    };
    let date = new Date().toLocaleString("ru", options);

    return date;
};
