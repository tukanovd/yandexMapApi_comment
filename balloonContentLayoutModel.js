var template = require(`./newModal.hbs`);

module.exports = {
    getCustomBalloonLayout(data = {}, myMap) {
        let balloonLayout = ymaps.templateLayoutFactory.createClass(
            template(data)
        );
        // debugger;
        // ymaps.layout.storage.add('my#balloonLayout', balloonLayout);
        return balloonLayout;
    }
};