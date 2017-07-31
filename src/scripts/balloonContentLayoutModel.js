var template = require(`./src/template/newModal.hbs`);

module.exports = {
    getCustomBalloonLayout(data = {}, myMap) {
        let balloonLayout = ymaps.templateLayoutFactory.createClass(
            template(data)
        );

        return balloonLayout;
    }
};