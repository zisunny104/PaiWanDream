const { getRandom } = require('../../shared/utils');
const Constants = require('../../shared/constants')
const Item = require('./item')

class Card extends Item {
    constructor(x, y, type, card_name, raw_name, description, file_name) {
        x = x + getRandom(0, 5);
        y = y + getRandom(0, 5);
        var w = Constants.CARD.SIZE_W;
        var h = Constants.CARD.SIZE_H;
        if (type == "危機") {
            w = Constants.CARD.SIZE_B_W;
            h = Constants.CARD.SIZE_B_H;
        }
        super({
            x, y, w, h,
        });

        this.isOver = false;

        //卡片資訊
        this.type = type;//卡片類型
        this.card_name = card_name;//卡片名稱
        this.raw_name = raw_name;//族語名稱
        this.description = description;//卡片說明
        this.file_name = file_name;//圖檔名稱

    }

    add(player) {
        switch (this.type) {
            case 'speed':
                player.speed += 500;
                break;
        }
    }

    remove(player) {
        switch (this.type) {
            case 'speed':
                player.speed -= 500;
                break;
        }
    }


    update(dt) {
        this.time -= dt;
    }

    serializeForUpdate() {
        return {
            ...(super.serializeForUpdate()),
            type: this.type,
            card_name: this.card_name,
            raw_name: this.raw_name,
            description: this.description,
            file_name: this.file_name
        }
    }
}

module.exports = Card;