function openBallonFromClusterer(e) {
    convertAddressToCoords.getCoords(e.innerHTML).then((res) => {
        getBalloon({address: e.innerHTML}, res);
    });
};
module.exports = {
    setClusterer() {
        let clustererLayout = ymaps.templateLayoutFactory.createClass(
            '<h2 class=ballon_header> {{properties.place|raw}}</h2>' +
            '<div class=ballon_body>' +
            '<a href="#" id="addressCarousel">{{properties.address|raw}}</a></br>' +
            '{{properties.review|raw}}' +
            '</div>' +
            '<div class=ballon_footer>{{properties.date|raw}}</div>');

        let myClusterer = new ymaps.Clusterer({
            clusterDisableClickZoom: true,
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterBalloonItemContentLayout: clustererLayout,
            clusterBalloonPanelMaxMapArea: 0,
            clusterBalloonContentLayoutWidth: 200,
            clusterBalloonContentLayoutHeight: 130,
            clusterBalloonPagerSize: 5
        });
        myClusterer.balloon.events.add('open', (e) => {
            var addressLink = document.querySelector('#addressCarousel');

            addressLink.addEventListener('click', function () {
                openBallonFromClusterer(this);
            })
        });

        return myClusterer;
    }
}